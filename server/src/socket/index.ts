import { Server, Socket } from 'socket.io';

interface UserPresence {
  userId: string;
  socketId: string;
  username: string; // "Hna" or "Partner"
  onlineAt: Date;
}

// In-memory store for online users (simple for now)
const onlineUsers = new Map<string, UserPresence>();

// Biometric Sync Lock State
interface SyncLockState {
  initiatorSocketId: string | null;
  initiatorPosition: { x: number; y: number } | null;
  partnerSocketId: string | null;
  partnerPosition: { x: number; y: number } | null;
  isUnlocked: boolean;
}

const syncLockState: SyncLockState = {
  initiatorSocketId: null,
  initiatorPosition: null,
  partnerSocketId: null,
  partnerPosition: null,
  isUnlocked: false,
};

// Reset sync lock state
const resetSyncLock = () => {
  syncLockState.initiatorSocketId = null;
  syncLockState.initiatorPosition = null;
  syncLockState.partnerSocketId = null;
  syncLockState.partnerPosition = null;
  syncLockState.isUnlocked = false;
};

export const initializeSocket = (io: Server) => {
  console.log('🔌 Socket.io initialized');

  io.on('connection', (socket: Socket) => {
    console.log(`✨ User connected: ${socket.id}`);

    // Handle user joining presence channel
    socket.on('join_presence', (data: { userId: string; username: string }) => {
      const { userId, username } = data;

      const presence: UserPresence = {
        userId,
        socketId: socket.id,
        username,
        onlineAt: new Date(),
      };

      onlineUsers.set(socket.id, presence);
      console.log(`👤 ${username} is online!`);

      // Broadcast to everyone (including sender) that this user is online
      io.emit('user_online', {
        userId,
        username,
        onlineCount: onlineUsers.size,
      });

      // Send current online list to the new user
      const usersList = Array.from(onlineUsers.values()).map((u) => ({
        userId: u.userId,
        username: u.username,
      }));

      socket.emit('presence_sync', usersList);
    });

    // ========== BIOMETRIC SYNC LOCK EVENTS ==========

    // User starts holding finger on screen
    socket.on('sync_lock_touch_start', (data: { x: number; y: number }) => {
      const { x, y } = data;
      console.log(`🔒 Touch start from ${socket.id} at (${x.toFixed(2)}, ${y.toFixed(2)})`);

      // If no initiator, this user becomes the initiator
      if (!syncLockState.initiatorSocketId) {
        syncLockState.initiatorSocketId = socket.id;
        syncLockState.initiatorPosition = { x, y };

        // Broadcast to partner that initiator is touching
        socket.broadcast.emit('sync_lock_partner_touching', {
          position: { x, y },
          isWaiting: true,
        });
      }
      // If there's already an initiator and this is another user
      else if (syncLockState.initiatorSocketId !== socket.id) {
        syncLockState.partnerSocketId = socket.id;
        syncLockState.partnerPosition = { x, y };

        // Check if positions match (within threshold)
        const threshold = 0.15; // 15% tolerance
        const initiatorPos = syncLockState.initiatorPosition!;
        const dx = Math.abs(x - initiatorPos.x);
        const dy = Math.abs(y - initiatorPos.y);

        if (dx <= threshold && dy <= threshold) {
          // UNLOCK SUCCESS!
          syncLockState.isUnlocked = true;
          console.log('💖 SYNC LOCK UNLOCKED! Fingers touched across the distance!');

          io.emit('sync_lock_unlocked', {
            success: true,
            message: 'Your hearts are connected across the distance! 💕',
          });

          // Reset after a delay
          setTimeout(() => resetSyncLock(), 5000);
        } else {
          // Not aligned yet - send position update to both
          socket.emit('sync_lock_alignment', {
            yourPosition: { x, y },
            targetPosition: initiatorPos,
            isAligned: false,
          });

          io.to(syncLockState.initiatorSocketId).emit('sync_lock_partner_position', {
            partnerPosition: { x, y },
          });
        }
      }
    });

    // User moves finger while holding
    socket.on('sync_lock_touch_move', (data: { x: number; y: number }) => {
      const { x, y } = data;

      if (socket.id === syncLockState.initiatorSocketId) {
        syncLockState.initiatorPosition = { x, y };
        socket.broadcast.emit('sync_lock_partner_touching', {
          position: { x, y },
          isWaiting: true,
        });
      } else if (socket.id === syncLockState.partnerSocketId) {
        syncLockState.partnerPosition = { x, y };

        // Check alignment
        if (syncLockState.initiatorPosition) {
          const initiatorPos = syncLockState.initiatorPosition;
          const threshold = 0.15;
          const dx = Math.abs(x - initiatorPos.x);
          const dy = Math.abs(y - initiatorPos.y);

          if (dx <= threshold && dy <= threshold) {
            syncLockState.isUnlocked = true;
            console.log('💖 SYNC LOCK UNLOCKED!');

            io.emit('sync_lock_unlocked', {
              success: true,
              message: 'Your hearts are connected across the distance! 💕',
            });

            setTimeout(() => resetSyncLock(), 5000);
          } else {
            socket.emit('sync_lock_alignment', {
              yourPosition: { x, y },
              targetPosition: initiatorPos,
              isAligned: false,
              distance: Math.sqrt(dx * dx + dy * dy),
            });
          }
        }
      }
    });

    // User releases finger
    socket.on('sync_lock_touch_end', () => {
      console.log(`👆 Touch end from ${socket.id}`);

      if (socket.id === syncLockState.initiatorSocketId) {
        resetSyncLock();
        io.emit('sync_lock_reset', { reason: 'initiator_released' });
      } else if (socket.id === syncLockState.partnerSocketId) {
        syncLockState.partnerSocketId = null;
        syncLockState.partnerPosition = null;

        if (syncLockState.initiatorSocketId) {
          io.to(syncLockState.initiatorSocketId).emit('sync_lock_partner_released');
        }
      }
    });

    // Request sync lock status
    socket.on('sync_lock_status', () => {
      socket.emit('sync_lock_state', {
        isActive: syncLockState.initiatorSocketId !== null,
        isUnlocked: syncLockState.isUnlocked,
        hasPartner: syncLockState.partnerSocketId !== null,
        onlineCount: onlineUsers.size,
      });
    });

    // ========== END BIOMETRIC SYNC LOCK ==========

    // Handle typing indicators (future proofing)
    socket.on('typing_start', (data: { username: string }) => {
      socket.broadcast.emit('user_typing', data);
    });

    socket.on('typing_end', () => {
      socket.broadcast.emit('user_stopped_typing');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        console.log(`👋 ${user.username} went offline`);
        onlineUsers.delete(socket.id);

        io.emit('user_offline', {
          userId: user.userId,
          username: user.username,
          onlineCount: onlineUsers.size,
        });
      } else {
        console.log(`Checking out: ${socket.id}`);
      }

      // Clean up sync lock if this user was part of it
      if (socket.id === syncLockState.initiatorSocketId) {
        resetSyncLock();
        io.emit('sync_lock_reset', { reason: 'initiator_disconnected' });
      } else if (socket.id === syncLockState.partnerSocketId) {
        syncLockState.partnerSocketId = null;
        syncLockState.partnerPosition = null;
      }
    });
  });

  return io;
};

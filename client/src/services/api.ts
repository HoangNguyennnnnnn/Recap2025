import { getToken } from '../utils/auth';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Video {
  publicId: string;
  url: string;
  thumbnail: string;
  duration: number;
  format: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface Photo {
  publicId: string;
  url: string;
  thumbnail: string;
  medium: string;
  large: string;
  placeholder: string;
  createdAt: string;
  caption?: string;
  batchId?: string;
}

export interface IHnaGallery {
  _id: string;
  title?: string;
  description?: string;
  photos: {
    publicId: string;
    url: string;
    caption?: string;
    order: number;
  }[];
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchHnaGalleryResponse {
  sets: IHnaGallery[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface Album {
  name: string;
  path: string;
  count: number;
}

export interface IMemory {
  _id: string;
  title: string;
  description?: string;
  date: string;
  photos: string[];
  story?: string;
  tags: string[];
  location?: string;
  sender: 'nthz' | 'hna';
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  memoryId: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface IReaction {
  _id: string;
  targetType: 'memory' | 'video' | 'photo';
  targetId: string;
  type: 'like' | 'love' | 'heart';
  userId?: string;
}

export interface ILetter {
  _id: string;
  content: string | null;
  unlockDate: string;
  isOpened: boolean;
  isLocked: boolean;
  sender: 'nthz' | 'hna';
  createdAt: string;
  updatedAt: string;
}

export interface IVoiceNote {
  _id: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  audioUrl: string;
  transcript?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISecretMedia {
  _id: string;
  type: 'photo' | 'video' | 'note';
  title: string;
  content?: string;
  url?: string;
  publicId?: string;
  date: string;
  createdAt: string;
}

export interface MemoryDetailResponse {
  memory: IMemory;
  comments: IComment[];
  reactions: IReaction[];
}

interface FetchMemoriesResponse {
  memories: IMemory[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface FetchVideosResponse {
  videos: Video[];
  total: number;
  nextCursor: string | null;
}

interface FetchPhotosResponse {
  album: string;
  photos: Photo[];
  total: number;
  nextCursor: string | null;
}

interface FetchAlbumsResponse {
  folders: Album[];
  total: number;
}

/**
 * Fetch all video memories
 */
export const fetchVideos = async (): Promise<Video[]> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/media/videos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    throw new Error('Failed to fetch videos from server.');
  }

  const data: FetchVideosResponse = await response.json();
  return data.videos;
};

/**
 * Fetch all available photo albums (folders)
 */
export const fetchAlbums = async (): Promise<Album[]> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/media/folders`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    throw new Error('Failed to fetch albums from server.');
  }

  const data: FetchAlbumsResponse = await response.json();
  return data.folders;
};

/**
 * Fetch photos from a specific album
 */
export const fetchPhotos = async (albumName: string): Promise<Photo[]> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/media/photos/${albumName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    if (response.status === 404) {
      return []; // Return empty array if album not found or empty
    }
    throw new Error(`Failed to fetch photos for album ${albumName}`);
  }

  const data: FetchPhotosResponse = await response.json();
  return data.photos;
};

/**
 * Fetch all photos for the Hna Gallery (general uploads)
 */
export const fetchHnaGallerySets = async (page = 1, limit = 12): Promise<FetchHnaGalleryResponse> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/media/hna-gallery?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch gallery sets');
  }

  return response.json();
};

export const createHnaGallerySet = async (data: any): Promise<any> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/media/hna-gallery`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create gallery set');
  }

  return response.json();
};

export const fetchAllPhotos = async (limit = 20, nextCursor?: string): Promise<FetchPhotosResponse> => {
  const token = getToken();
  let url = `${API_URL}/api/media/photos?limit=${limit}`;
  if (nextCursor) url += `&nextCursor=${nextCursor}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    throw new Error('Failed to fetch gallery photos.');
  }

  return response.json();
};

/**
 * Fetch all memories for the Vault
 */
export const fetchMemories = async (page = 1, limit = 20): Promise<FetchMemoriesResponse> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/memories?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    throw new Error('Failed to fetch memories.');
  }

  return response.json();
};

/**
 * Fetch a single memory by ID with full details
 */
export const fetchMemoryById = async (id: string): Promise<MemoryDetailResponse> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/memories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    if (response.status === 404) {
      throw new Error('Memory not found.');
    }
    throw new Error('Failed to fetch memory details.');
  }

  return response.json();
};

/**
 * Add a comment to a memory
 */
export const postComment = async (memoryId: string, content: string): Promise<IComment> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/memories/${memoryId}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to post comment.');
  }

  return response.json();
};

/**
 * Toggle a reaction on a target
 */
export const toggleReaction = async (
  targetType: 'memory' | 'video' | 'photo',
  targetId: string,
  type: 'like' | 'love' | 'heart' = 'love'
): Promise<IReaction> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/reactions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetType, targetId, type }),
  });

  if (!response.ok) {
    throw new Error('Failed to update reaction.');
  }

  return response.json();
};

/**
 * Fetch all letters from the Secret Vault
 */
export const fetchLetters = async (): Promise<ILetter[]> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/letters`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    throw new Error('Failed to fetch letters.');
  }

  return response.json();
};

/**
 * Fetch a single letter's content (Enforces time-gating)
 */
export const fetchLetterById = async (id: string): Promise<ILetter> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/letters/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access.');
    }
    if (response.status === 403) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'This letter is still maturing in the vault.');
    }
    if (response.status === 404) {
      throw new Error('Letter not found.');
    }
    throw new Error('Failed to fetch letter.');
  }

  return response.json();
};

/**
 * Fetch all voice messages for the Echoes Map
 */
export const fetchVoiceNotes = async (): Promise<IVoiceNote[]> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/voice`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    throw new Error('Failed to fetch voice notes.');
  }

  return response.json();
};

/**
 * Save a new voice note
 */
export const postVoiceNote = async (data: {
  location: string;
  coordinates: { lat: number; lng: number };
  audioUrl: string;
  transcript?: string;
  date: string;
}): Promise<{ success: boolean; voiceNote: IVoiceNote }> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/voice`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to save voice note.');
  }

  return response.json();
};

// ========== MEMORY CRUD OPERATIONS ==========

export interface CreateMemoryData {
  title: string;
  date: string;
  description?: string;
  story?: string;
  photos?: string[];
  tags?: string[];
  location?: string;
  sender?: 'nthz' | 'hna';
}

export interface UpdateMemoryData {
  title?: string;
  date?: string;
  description?: string;
  story?: string;
  photos?: string[];
  tags?: string[];
  location?: string;
  sender?: 'nthz' | 'hna';
}

/**
 * Create a new memory milestone
 */
export const createMemory = async (
  data: CreateMemoryData
): Promise<{ success: boolean; memory: IMemory }> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/memories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Title and date are required.');
    }
    throw new Error('Failed to create memory.');
  }

  return response.json();
};

/**
 * Update an existing memory milestone
 */
export const updateMemory = async (
  id: string,
  data: UpdateMemoryData
): Promise<{ success: boolean; memory: IMemory }> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/memories/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    if (response.status === 404) {
      throw new Error('Memory not found.');
    }
    throw new Error('Failed to update memory.');
  }

  return response.json();
};

/**
 * Delete a memory milestone
 */
export const deleteMemory = async (id: string): Promise<{ success: boolean; message: string }> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/memories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    if (response.status === 404) {
      throw new Error('Memory not found.');
    }
    throw new Error('Failed to delete memory.');
  }

  return response.json();
};

// ========== LETTER CRUD OPERATIONS ==========

export interface CreateLetterData {
  content: string;
  unlockDate: string;
  sender?: 'nthz' | 'hna';
}

/**
 * Create a new secret letter with time-lock
 */
export const createLetter = async (
  data: CreateLetterData
): Promise<{ success: boolean; letter: ILetter }> => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/letters`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Content and unlock date are required.');
    }
    throw new Error('Failed to create letter.');
  }

  return response.json();
};

/**
 * Fetch all secrets for the Secret Room
 */
export const fetchSecrets = async (): Promise<ISecretMedia[]> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/media/secret-room`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch secrets');
  }

  return response.json();
};

/**
 * Add a new secret item
 */
export const addSecret = async (data: any): Promise<any> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/media/secret-room`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add secret');
  }

  return response.json();
};

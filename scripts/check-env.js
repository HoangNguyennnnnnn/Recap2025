import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredEnvVars = {
    server: [
        'PORT',
        'NODE_ENV',
        'MONGODB_URI',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'ALLOWED_ORIGINS',
        'JWT_SECRET',
    ],
    client: ['VITE_API_URL', 'VITE_APP_NAME'],
};

function checkEnvFile(packageName, envPath, requiredVars) {
    console.log(`\n🔍 Checking ${packageName} environment variables...`);

    if (!fs.existsSync(envPath)) {
        console.log(`❌ ${envPath} not found!`);
        console.log(`   Create it by copying .env.example:`);
        console.log(`   cp ${envPath}.example ${envPath}`);
        return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const missingVars = [];

    requiredVars.forEach((varName) => {
        const regex = new RegExp(`^${varName}=.+`, 'm');
        if (!regex.test(envContent)) {
            missingVars.push(varName);
        }
    });

    if (missingVars.length > 0) {
        console.log(`⚠️  Missing or empty variables in ${envPath}:`);
        missingVars.forEach((v) => console.log(`   - ${v}`));
        return false;
    }

    console.log(`✅ All required variables are set in ${packageName}`);
    return true;
}

console.log('═══════════════════════════════════════');
console.log('  Environment Variables Check');
console.log('═══════════════════════════════════════');

const serverEnvPath = path.join(__dirname, '..', 'server', '.env');
const clientEnvPath = path.join(__dirname, '..', 'client', '.env');

const serverOk = checkEnvFile('server', serverEnvPath, requiredEnvVars.server);
const clientOk = checkEnvFile('client', clientEnvPath, requiredEnvVars.client);

console.log('\n═══════════════════════════════════════');
if (serverOk && clientOk) {
    console.log('✅ All environment checks passed!');
    console.log('═══════════════════════════════════════\n');
    process.exit(0);
} else {
    console.log('❌ Environment check failed!');
    console.log('   Fix the issues above before deploying.');
    console.log('═══════════════════════════════════════\n');
    process.exit(1);
}

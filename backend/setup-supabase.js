const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 Setting up Supabase migration...\n');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Creating template...\n');
  const envTemplate = `DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
JWT_SECRET="${require('crypto').randomBytes(32).toString('hex')}"
PORT=5000
`;
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file with template');
  console.log('📝 Please update DATABASE_URL with your Supabase connection string\n');
} else {
  console.log('✅ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('[YOUR-PASSWORD]') || envContent.includes('[PROJECT-REF]')) {
    console.log('⚠️  Please update DATABASE_URL in .env with your Supabase connection string\n');
  } else if (envContent.includes('postgresql://')) {
    console.log('✅ DATABASE_URL appears to be configured\n');
  } else {
    console.log('⚠️  DATABASE_URL might not be configured for PostgreSQL\n');
  }
}

console.log('📦 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Prisma client generated successfully\n');
} catch (error) {
  console.error('❌ Error generating Prisma client:', error.message);
  process.exit(1);
}

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://') && !process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
  console.log('🗄️  Running database migrations...');
  try {
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Database migrations completed successfully\n');
  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    console.log('\n💡 Make sure your DATABASE_URL is correct and your Supabase database is accessible');
    process.exit(1);
  }
} else {
  console.log('⏭️  Skipping migrations - DATABASE_URL not configured yet');
  console.log('\n📋 Next steps:');
  console.log('1. Get your Supabase connection string from Settings → Database');
  console.log('2. Update DATABASE_URL in backend/.env');
  console.log('3. Run: npm run setup-supabase (or node setup-supabase.js)');
  console.log('4. Or manually run: npx prisma migrate dev --name init\n');
}

console.log('✨ Setup complete!');


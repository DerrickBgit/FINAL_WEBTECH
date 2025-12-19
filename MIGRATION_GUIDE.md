# Database Migration Guide: Local to Hosted

This guide will help you migrate your data from a local MySQL database to a hosted database and deploy to Vercel.

## Step 1: Choose a Hosted Database Provider

### Option A: PlanetScale (Recommended for Vercel)
- **Why**: Built-in connection pooling, serverless-optimized, free tier available
- **Sign up**: https://planetscale.com
- **Free tier**: 1 database, 1GB storage, 1 billion row reads/month

### Option B: Railway
- **Why**: Easy setup, good pricing
- **Sign up**: https://railway.app
- **Free tier**: $5 credit/month

### Option C: Supabase
- **Why**: PostgreSQL option, generous free tier
- **Note**: Requires changing Prisma schema from MySQL to PostgreSQL
- **Sign up**: https://supabase.com

### Option D: AWS RDS / DigitalOcean
- **Why**: More control, enterprise-grade
- **Note**: More complex setup

**For this guide, we'll use PlanetScale as an example.**

---

## Step 2: Create Hosted Database

### PlanetScale Setup:
1. Sign up at https://planetscale.com
2. Create a new database (e.g., "inventory-management")
3. Select a region close to you
4. Once created, click "Connect" to get your connection string
5. Copy the connection string (looks like):
   ```
   mysql://username:password@host:port/database?sslaccept=strict
   ```

---

## Step 3: Export Data from Local Database

### Method 1: Using mysqldump (Recommended)

1. **Open terminal/PowerShell** in your project root

2. **Export schema and data**:
   ```bash
   mysqldump -u your_username -p your_database_name > local_backup.sql
   ```
   
   Example:
   ```bash
   mysqldump -u root -p inventory_db > local_backup.sql
   ```
   
   Enter your MySQL password when prompted.

3. **Verify the backup file was created**:
   ```bash
   ls -lh local_backup.sql
   ```
   (or `dir local_backup.sql` on Windows)

### Method 2: Using Prisma Studio (For small datasets)

1. **Open Prisma Studio**:
   ```bash
   npx prisma studio
   ```

2. **Manually export data** from each table (not recommended for large datasets)

---

## Step 4: Prepare Prisma for Hosted Database

### Update Prisma Schema (if needed)

Your `prisma/schema.prisma` should already be correct, but verify:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Create Migration for Hosted Database

1. **Set your hosted DATABASE_URL temporarily**:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"
   
   # Or create .env file with:
   # DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"
   ```

2. **Push schema to hosted database** (creates tables):
   ```bash
   npx prisma db push
   ```
   
   **OR** if you want to use migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

---

## Step 5: Import Data to Hosted Database

### Method 1: Using MySQL Command Line

1. **Import the backup**:
   ```bash
   mysql -h your_host -u your_username -p your_database_name < local_backup.sql
   ```
   
   For PlanetScale, use the connection details from Step 2:
   ```bash
   mysql -h aws.connect.psdb.cloud -u username -p database_name < local_backup.sql
   ```

2. **Enter password** when prompted

### Method 2: Using PlanetScale CLI (Recommended for PlanetScale)

1. **Install PlanetScale CLI**:
   ```bash
   # Windows (using Scoop)
   scoop install planetscale
   
   # Or download from: https://github.com/planetscale/cli/releases
   ```

2. **Login**:
   ```bash
   pscale auth login
   ```

3. **Import data**:
   ```bash
   pscale database import local_backup.sql your-database-name your-branch-name
   ```

### Method 3: Using Prisma Seed Script (For programmatic import)

1. **Create a seed script** (`prisma/seed.js`):
   ```javascript
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();
   
   async function main() {
     // Read your local backup or use Prisma to query local DB
     // Then insert into hosted DB
     // Example:
     const users = await localPrisma.user.findMany();
     for (const user of users) {
       await prisma.user.create({ data: user });
     }
     // Repeat for all tables
   }
   
   main()
     .catch(console.error)
     .finally(() => prisma.$disconnect());
   ```

2. **Run seed**:
   ```bash
   node prisma/seed.js
   ```

---

## Step 6: Verify Data Migration

1. **Connect to hosted database**:
   ```bash
   npx prisma studio
   ```
   
   Make sure `DATABASE_URL` in `.env` points to your hosted database.

2. **Check data**:
   - Verify all tables exist
   - Check record counts match
   - Spot-check a few records

3. **Test queries**:
   ```bash
   npx prisma db execute --stdin
   ```
   Then run: `SELECT COUNT(*) FROM users;`

---

## Step 7: Update Environment Variables

### For Local Development:

Create/update `.env.local`:
```env
DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"
JWT_SECRET="your-secret-key-here"
REACT_APP_API_URL="http://localhost:3000/api"
```

### For Vercel Deployment:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (or create new one)
3. **Go to Settings > Environment Variables**
4. **Add these variables**:
   - `DATABASE_URL` = `mysql://username:password@host:port/database?sslaccept=strict`
   - `JWT_SECRET` = `your-secret-key-here` (use a strong random string)
   - `REACT_APP_API_URL` = `/api` (for production)

5. **Apply to all environments** (Production, Preview, Development)

---

## Step 8: Deploy to Vercel

### First Time Setup:

1. **Install Vercel CLI** (if not already):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name: **inventory-management** (or your choice)
   - Directory: **./** (current directory)
   - Override settings: **No**

4. **After deployment**, Vercel will run `prisma generate` automatically if you have it in `package.json` scripts.

### Update package.json (if needed):

Add Prisma scripts back:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "prisma:generate": "prisma generate"
  }
}
```

### Run Migrations on Vercel:

After first deployment, you may need to run migrations:

1. **Via Vercel CLI**:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. **Or add to build command** in Vercel settings:
   ```
   npm run build && npx prisma migrate deploy
   ```

---

## Step 9: Test Production API

1. **Get your Vercel URL**: `https://your-app.vercel.app`

2. **Test health endpoint**:
   ```bash
   curl https://your-app.vercel.app/api/health
   ```
   
   Should return: `{"status":"ok","message":"Backend is running"}`

3. **Test login**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

---

## Troubleshooting

### Issue: Connection timeout
**Solution**: Check firewall settings, ensure SSL is enabled (`?sslaccept=strict`)

### Issue: Authentication failed
**Solution**: Verify username/password in connection string, check database user permissions

### Issue: Table doesn't exist
**Solution**: Run `npx prisma db push` or `npx prisma migrate deploy` on hosted database

### Issue: Data not showing
**Solution**: 
- Verify `DATABASE_URL` in Vercel environment variables
- Check Prisma client is generated: `npx prisma generate`
- Verify data was imported correctly

### Issue: Cold starts slow
**Solution**: 
- Use PlanetScale (built-in connection pooling)
- Or use Prisma Data Proxy
- Keep Prisma client in global scope (already done in `api/lib/prisma.js`)

---

## Quick Reference Commands

```bash
# Export local database
mysqldump -u root -p inventory_db > backup.sql

# Import to hosted database
mysql -h host -u user -p database < backup.sql

# Push schema to hosted DB
npx prisma db push

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (verify data)
npx prisma studio

# Deploy to Vercel
vercel

# Pull Vercel env vars locally
vercel env pull .env.local
```

---

## Compatibility with Vercel

✅ **Yes, fully compatible!**

- ✅ Serverless functions work with any MySQL/PostgreSQL database
- ✅ Prisma works seamlessly with hosted databases
- ✅ Connection pooling recommended (PlanetScale has this built-in)
- ✅ Environment variables securely stored in Vercel
- ✅ Automatic Prisma client generation on deploy

**Best Practices for Vercel:**
1. Use connection pooling (PlanetScale or Prisma Data Proxy)
2. Keep Prisma client singleton (already implemented)
3. Set `DATABASE_URL` in Vercel environment variables
4. Use `prisma generate` in postinstall script

---

## Next Steps After Migration

1. ✅ Update local `.env.local` to point to hosted DB (optional, for testing)
2. ✅ Test all API endpoints in production
3. ✅ Monitor Vercel function logs for errors
4. ✅ Set up database backups (most providers do this automatically)
5. ✅ Consider setting up monitoring (Vercel Analytics, Sentry, etc.)

---

## Need Help?

- **PlanetScale Docs**: https://docs.planetscale.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Migrations**: https://www.prisma.io/docs/guides/migrate

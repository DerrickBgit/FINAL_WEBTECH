# Migrating to Supabase (PostgreSQL)

This guide will help you migrate your inventory management system from MySQL to Supabase (PostgreSQL).

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. Your existing project setup

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in (or create an account)
2. Click "New Project"
3. Fill in:
   - **Name**: Your project name (e.g., "inventory-management")
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be set up (takes 1-2 minutes)

## Step 2: Get Your Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
5. Replace `[YOUR-PASSWORD]` with the password you set when creating the project

## Step 3: Update Your Environment Variables

1. In your `backend` folder, create or update `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
   JWT_SECRET="your-jwt-secret-here"
   PORT=5000
   ```

   **Important Notes:**
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - Replace `[PROJECT-REF]` with your Supabase project reference
   - The `?pgbouncer=true&connection_limit=1` parameters are recommended for Supabase connection pooling

## Step 4: Install PostgreSQL Client (if needed)

The Prisma client should work with PostgreSQL, but you may need to ensure you have the PostgreSQL driver:

```bash
cd backend
npm install pg
```

## Step 5: Generate Prisma Client and Run Migrations

1. Generate the Prisma client with the new PostgreSQL schema:
   ```bash
   cd backend
   npx prisma generate
   ```

2. Create and run the initial migration:
   ```bash
   npx prisma migrate dev --name init
   ```

   This will:
   - Create all the tables in your Supabase database
   - Set up all relationships and constraints
   - Create the migration history

## Step 6: Verify the Migration

1. Check your Supabase dashboard:
   - Go to **Table Editor** to see all your tables
   - Verify that all tables are created: `users`, `categories`, `items`, `stock_movements`, `sales`

2. Test your application:
   ```bash
   cd backend
   npm start
   ```

3. Try creating a user account and adding some test data

## Step 7: (Optional) Migrate Existing Data

If you have existing data in your MySQL database, you'll need to export and import it:

1. **Export from MySQL:**
   ```bash
   mysqldump -u [username] -p [database_name] > backup.sql
   ```

2. **Convert SQL syntax** (MySQL to PostgreSQL):
   - Use a tool like `pgloader` or manually convert the SQL
   - Or use Supabase's import feature in the dashboard

3. **Import to Supabase:**
   - Go to Supabase Dashboard → SQL Editor
   - Run your converted SQL statements

## Differences Between MySQL and PostgreSQL

The schema has been updated to work with PostgreSQL. Key differences handled:

- ✅ Decimal types: `@db.Decimal(10, 2)` works the same way
- ✅ Auto-increment: Uses PostgreSQL's `SERIAL` (handled by Prisma)
- ✅ DateTime: Works identically
- ✅ Foreign keys: Same syntax

## Troubleshooting

### Connection Issues

If you get connection errors:
- Verify your password is correct in the connection string
- Check that your IP is allowed (Supabase allows all IPs by default, but check Settings → Database → Connection Pooling)
- Ensure you're using the correct project reference

### Migration Errors

If migrations fail:
- Check the Supabase dashboard for error messages
- Verify all environment variables are set correctly
- Try resetting the database (Settings → Database → Reset database) and running migrations again

### Prisma Client Issues

If Prisma client doesn't work:
```bash
cd backend
npx prisma generate
npm install @prisma/client
```

## Next Steps

1. Update your production environment variables
2. Test all CRUD operations
3. Monitor your Supabase dashboard for usage and performance
4. Set up database backups (Supabase handles this automatically)

## Supabase Features You Can Now Use

- **Real-time subscriptions**: Subscribe to database changes in real-time
- **Row Level Security (RLS)**: Add database-level security policies
- **Storage**: Use Supabase Storage for file uploads (if needed)
- **Auth**: Consider migrating to Supabase Auth (optional)

## Support

- Supabase Docs: https://supabase.com/docs
- Prisma + PostgreSQL: https://www.prisma.io/docs/concepts/database-connectors/postgresql

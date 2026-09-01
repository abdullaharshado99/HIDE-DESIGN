# NestJS Backend Render Deployment Guide

## ✅ Changes Made

### 1. **package.json Updates**
- ✅ Added `ts-node` and `tsconfig-paths` to `dependencies` (moved from devDependencies so they're available in production)
- ✅ Added new script: `"start:seed": "npm run seed && npm run start:prod"`

**What this does:** The start:seed script will run seed.ts to initialize the admin user and products before starting the app.

### 2. **src/main.ts Update**
- ✅ Changed default PORT from `3002` to `3001`

**What this does:** Port 3001 is now the default. Can still be overridden via PORT environment variable.

### 3. **src/app.module.ts** 
- ✅ Already configured correctly with SSL support for Render PostgreSQL
- ✅ Respects `DB_SSL` environment variable

**Configuration:**
```typescript
ssl: config.get('DB_SSL', 'false') === 'true' ? {
  rejectUnauthorized: false,
} : false,
```

### 4. **src/seed.ts**
- ✅ Already configured to accept `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables
- ✅ Creates admin user if it doesn't exist

**Configuration:**
```typescript
const email = (process.env.ADMIN_EMAIL ?? 'admin@hidesdesign.com').toLowerCase();
passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'change-this-password', 12),
```

---

## 🔧 Render Deployment Configuration

### Step 1: Set Environment Variables in Render Dashboard
Go to your Render service → Environment → Add the following variables:

```
DB_HOST=your-postgres-host.render.com
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_SSL=true                              # ← CRITICAL for Render PostgreSQL
DB_SYNCHRONIZE=false                     # Set to false for production
ADMIN_EMAIL=admin@hidesdesign.com        # ← Your admin email
ADMIN_PASSWORD=Admin123                  # ← Your admin password
PORT=3001                                # ← Backend port
FRONTEND_URL=https://hidesdesign.com     # ← Your Next.js frontend URL
JWT_SECRET=your_jwt_secret_key           # ← Should be a strong random string
```

### Step 2: Update Build Command
In Render Dashboard → Build & Deploy → Build Command:
```bash
npm run build
```

### Step 3: Update Start Command
In Render Dashboard → Build & Deploy → Start Command:
```bash
npm run start:seed
```

This will:
1. Run seed.ts to create the admin user and products
2. Start the NestJS server on port 3001

### Step 4: Deploy
1. Push your changes to GitHub
2. Render will automatically deploy with the new configuration
3. Check Render logs to verify seed runs successfully:
   ```
   ✓ Seeding admin user: admin@hidesdesign.com
   ✓ Seeding 10 products
   ✓ Backend running on http://localhost:3001
   ```

---

## ✔️ Testing After Deployment

### Test 1: Admin Login
```bash
curl -X POST https://your-backend.render.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hidesdesign.com",
    "password": "Admin123"
  }'
```

Expected response: JWT token in response

### Test 2: Health Check
```bash
curl https://your-backend.render.com/health
```

Expected response: `{"status":"ok"}`

### Test 3: Verify Products Seeded
```bash
curl https://your-backend.render.com/products
```

Expected response: Array of 10 products (HD-M01 through HD-W05)

---

## 🐛 Troubleshooting

### "Exited with status 1" Error
- Check Render logs for seed errors
- Verify all `DB_*` environment variables are set correctly
- Ensure `DB_SSL=true` is set for Render PostgreSQL

### Admin Login Fails
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in Render environment
- Check that seed ran successfully in logs
- Try clearing the database and redeploying

### Database Connection Timeout
- Verify `DB_SSL=true` is set
- Check PostgreSQL host, port, and credentials
- Ensure Render PostgreSQL is in the same Render account

### Port Already in Use
- Verify `PORT=3001` is set in Render environment
- Don't set PORT to a port Render reserves (like 80, 443)

---

## 📝 Files Changed

1. `package.json` - Added ts-node/tsconfig-paths to dependencies, added start:seed script
2. `src/main.ts` - Updated default PORT to 3001
3. `src/app.module.ts` - No changes needed (already configured correctly)
4. `src/seed.ts` - No changes needed (already configured correctly)

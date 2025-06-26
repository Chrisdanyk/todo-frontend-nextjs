# Environment Configuration Guide

This guide explains how to set up environment variables for both the backend and frontend applications.

## 🚀 Quick Setup

### 1. Backend Environment Setup

1. **Copy the example file:**
   ```bash
   cd backend-nestjs
   cp env.example .env
   ```

2. **Edit `.env` with your values:**
   ```env
   # Server Configuration
   PORT=3000
   
   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
   
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Environment
   NODE_ENV=development
   ```

### 2. Frontend Environment Setup

1. **Copy the example file:**
   ```bash
   cd frontend-nextjs
   cp env.example .env.local
   ```

2. **Edit `.env.local` with your values:**
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   
   # Environment
   NODE_ENV=development
   ```

## 📋 Environment Variables Explained

### Backend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | localhost URLs | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `JWT_EXPIRES_IN` | Access token expiration | 1h | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d | No |
| `NODE_ENV` | Environment mode | development | No |

### Frontend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:3000 | No |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | http://localhost:3001 | No |
| `NODE_ENV` | Environment mode | development | No |

## 🔧 Configuration Examples

### Development Setup
```env
# Backend (.env)
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
DATABASE_URL="postgresql://postgres:password@localhost:5432/todo_dev"
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

### Production Setup
```env
# Backend (.env)
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DATABASE_URL="postgresql://user:pass@prod-db:5432/todo_prod"
JWT_SECRET=your-super-secure-production-secret
NODE_ENV=production

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## 🔒 Security Best Practices

1. **Never commit `.env` files to version control**
2. **Use strong, unique JWT secrets**
3. **Limit CORS origins in production**
4. **Use environment-specific database URLs**
5. **Rotate secrets regularly**

## 🚨 Troubleshooting

### Common Issues

1. **CORS errors**: Check `ALLOWED_ORIGINS` includes your frontend URL
2. **Database connection**: Verify `DATABASE_URL` format and credentials
3. **JWT errors**: Ensure `JWT_SECRET` is set and consistent
4. **Port conflicts**: Change `PORT` if 3000 is already in use

### Validation

After setting up, restart both servers:

```bash
# Backend
cd backend-nestjs
pnpm start:dev

# Frontend
cd frontend-nextjs
pnpm dev --port 3001
```

You should see the CORS origins logged in the backend console when it starts.

## 📝 Notes

- Frontend variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Backend variables are server-side only
- Use different values for development, staging, and production
- Consider using a secrets manager for production deployments 
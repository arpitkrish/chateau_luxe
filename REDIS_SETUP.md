# Redis Setup for Chateau Luxe Hotel Management System

## Overview
This system now includes Redis caching for improved performance. Redis is used for:
- Session storage (instead of memory)
- API response caching
- Static file caching with proper headers

## Prerequisites

### Install Redis
Choose one of the following methods:

#### Option 1: Windows (using Chocolatey)
```powershell
choco install redis-64
```

#### Option 2: Windows (manual download)
1. Download Redis for Windows from: https://redis.io/download
2. Extract to a folder (e.g., C:\Redis)
3. Add to PATH environment variable

#### Option 3: Using Docker
```bash
docker run --name redis -p 6379:6379 -d redis:alpine
```

## Configuration

### Environment Variables (.env)
The following Redis configuration is already added to your `.env` file:
```
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
CACHE_TTL=3600
```

- `REDIS_URL`: Redis connection URL (default: localhost:6379)
- `REDIS_PASSWORD`: Redis password (leave empty if no password)
- `CACHE_TTL`: Cache time-to-live in seconds (default: 1 hour)

## Starting Redis

### Windows (if installed via Chocolatey)
```powershell
redis-server
```

### Windows (manual installation)
```cmd
C:\Redis\redis-server.exe
```

### Docker
```bash
docker start redis
```

## Running the Application

1. Start Redis server (as shown above)
2. Start your application:
```bash
npm start
# or for development
npm run dev
```

## Caching Features

### What's Cached
- **Rooms data** (`/api/rooms`) - 1 hour TTL
- **Facilities data** (`/api/facilities`) - 1 hour TTL
- **Food menu** (`/api/food`) - 30 minutes TTL
- **Static files** (CSS, JS, images) - 1 day TTL
- **User sessions** - stored in Redis

### Cache Invalidation
- Automatically clears room cache when room bookings are created
- Automatically clears facility cache when facility bookings are created
- Cache invalidation happens immediately after data modifications

## Monitoring Cache

You can monitor Redis activity:
```bash
redis-cli
> KEYS *
> GET cache:/api/rooms
> INFO
```

## Troubleshooting

### Connection Issues
- Ensure Redis is running on port 6379
- Check firewall settings
- Verify REDIS_URL in .env file

### Cache Not Working
- Check Redis server logs
- Verify CACHE_TTL is set correctly
- Check application console for cache hit/miss messages

### Performance Impact
- Redis adds ~5-10ms latency per request
- But reduces database load significantly
- Monitor with `redis-cli INFO` command

## Viva Preparation Notes

For your viva, you can explain:
- **Why Redis?** For high-performance caching and session storage
- **What gets cached?** Static assets, API responses, user sessions
- **Cache strategy?** Time-based expiration with manual invalidation
- **Benefits?** Reduced database load, faster response times, better scalability
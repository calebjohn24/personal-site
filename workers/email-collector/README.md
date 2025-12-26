# Email Collector - Cloudflare Worker

A simple email subscription backend using Cloudflare Workers and D1 database.

## Setup Instructions

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create the D1 Database

```bash
cd workers/email-collector
npm install
npm run db:create
```

This will output a database ID. Copy it and update `wrangler.toml`:

```toml
database_id = "your-actual-database-id"
```

### 4. Initialize the Database Schema

```bash
npm run db:init
```

### 5. Set Admin API Key (Optional)

For the protected `/subscribers` and `/export` endpoints:

```bash
wrangler secret put ADMIN_API_KEY
# Enter a secure random string when prompted
```

### 6. Deploy

```bash
npm run deploy
```

### 7. Update Your Frontend

After deployment, update the `WORKER_URL` in your blog's JavaScript:

```javascript
const WORKER_URL = 'https://email-collector.YOUR_SUBDOMAIN.workers.dev/subscribe';
```

## API Endpoints

### POST /subscribe
Subscribe a new email address.

**Request:**
```json
{ "email": "user@example.com" }
```

**Response (201):**
```json
{ "message": "Successfully subscribed!" }
```

### GET /subscribers
List all subscribers (requires `Authorization: Bearer YOUR_API_KEY` header).

### GET /export
Export subscribers as CSV (requires `Authorization: Bearer YOUR_API_KEY` header).

## Local Development

```bash
# Start local dev server with D1
npm run db:init:local  # First time only
npm run dev
```

## Production CORS

For production, update the `corsHeaders` in `src/index.js`:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://calebjohn.xyz',
  // ...
};
```


-- D1 Database Schema for Email Subscribers
-- Run this to initialize your database:
-- wrangler d1 execute email-subscribers --file=./schema.sql

CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    unsubscribed_at TEXT DEFAULT NULL
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email ON subscribers(email);

-- Index for listing by date
CREATE INDEX IF NOT EXISTS idx_subscribed_at ON subscribers(subscribed_at);


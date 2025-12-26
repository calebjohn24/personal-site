/**
 * Email Collector Worker
 * Handles email subscriptions and stores them in Cloudflare D1
 */

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, replace with your domain: 'https://calebjohn.xyz'
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Simple email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // POST /subscribe - Add new subscriber
    if (request.method === 'POST' && url.pathname === '/subscribe') {
      try {
        const body = await request.json();
        const email = body.email?.trim().toLowerCase();

        // Validate email
        if (!email) {
          return Response.json(
            { error: 'Email is required' },
            { status: 400, headers: corsHeaders }
          );
        }

        if (!isValidEmail(email)) {
          return Response.json(
            { error: 'Please enter a valid email address' },
            { status: 400, headers: corsHeaders }
          );
        }

        // Check if email already exists
        const existing = await env.DB.prepare(
          'SELECT email FROM subscribers WHERE email = ?'
        ).bind(email).first();

        if (existing) {
          return Response.json(
            { message: 'You\'re already subscribed!' },
            { status: 200, headers: corsHeaders }
          );
        }

        // Insert new subscriber
        await env.DB.prepare(
          'INSERT INTO subscribers (email, subscribed_at, ip_address, user_agent) VALUES (?, ?, ?, ?)'
        ).bind(
          email,
          new Date().toISOString(),
          request.headers.get('CF-Connecting-IP') || 'unknown',
          request.headers.get('User-Agent') || 'unknown'
        ).run();

        return Response.json(
          { message: 'Successfully subscribed!' },
          { status: 201, headers: corsHeaders }
        );

      } catch (error) {
        console.error('Subscription error:', error);
        return Response.json(
          { error: 'Something went wrong. Please try again.' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // GET /subscribers - List all subscribers (protected, for admin use)
    if (request.method === 'GET' && url.pathname === '/subscribers') {
      // Simple API key auth - set this in your Worker environment variables
      const authHeader = request.headers.get('Authorization');
      const apiKey = env.ADMIN_API_KEY;

      if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
        return Response.json(
          { error: 'Unauthorized' },
          { status: 401, headers: corsHeaders }
        );
      }

      try {
        const result = await env.DB.prepare(
          'SELECT id, email, subscribed_at FROM subscribers ORDER BY subscribed_at DESC'
        ).all();

        return Response.json(
          { subscribers: result.results, count: result.results.length },
          { headers: corsHeaders }
        );
      } catch (error) {
        console.error('List error:', error);
        return Response.json(
          { error: 'Failed to fetch subscribers' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // GET /export - Export subscribers as CSV (protected)
    if (request.method === 'GET' && url.pathname === '/export') {
      const authHeader = request.headers.get('Authorization');
      const apiKey = env.ADMIN_API_KEY;

      if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
        return Response.json(
          { error: 'Unauthorized' },
          { status: 401, headers: corsHeaders }
        );
      }

      try {
        const result = await env.DB.prepare(
          'SELECT email, subscribed_at FROM subscribers ORDER BY subscribed_at DESC'
        ).all();

        const csv = 'email,subscribed_at\n' + 
          result.results.map(r => `${r.email},${r.subscribed_at}`).join('\n');

        return new Response(csv, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="subscribers.csv"',
          },
        });
      } catch (error) {
        return Response.json(
          { error: 'Failed to export' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // 404 for other routes
    return Response.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders }
    );
  },
};


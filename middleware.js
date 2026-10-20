// Password-protects every page of the portfolio (Vercel Routing Middleware).
// Set PORTFOLIO_PASSWORD (and optionally PORTFOLIO_USER) in Vercel → Settings → Environment Variables.

export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const password = process.env.PORTFOLIO_PASSWORD;
  const user = process.env.PORTFOLIO_USER || 'guest';
  if (!password) return; // no password set → site stays open

  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const [u, ...rest] = atob(auth.slice(6)).split(':');
      if (u === user && rest.join(':') === password) return; // allowed → continue to the page
    } catch (e) {}
  }

  return new Response('Password required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Tay Tom portfolio", charset="UTF-8"' }
  });
}

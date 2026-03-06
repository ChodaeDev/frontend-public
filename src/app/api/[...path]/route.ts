import { NextRequest } from 'next/server';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const url = `${ backendUrl }${ pathname }${ search }`;

  const headers = new Headers(req.headers);
  headers.delete('origin');
  headers.delete('host');

  const res = await fetch(url, {
    method: req.method,
    headers,
    body: req.body,
    // @ts-expect-error duplex is required for streaming request body
    duplex: 'half',
  });

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;

export async function onRequest(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const result = await res.json();

    if (result.error) {
      return new Response(`Error: ${result.error_description || result.error}`, { status: 401 });
    }

    const token = result.access_token;
    const origin = url.origin;

    // Redirect to a static page that communicates with the opener
    // The token is passed in the hash fragment (never sent to server)
    const redirectTo = `${origin}/admin/callback-success#token=${encodeURIComponent(token)}`;
    return Response.redirect(redirectTo, 302);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

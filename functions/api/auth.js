export async function onRequest(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const redirectUrl = new URL("https://github.com/login/oauth/authorize");
    redirectUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    redirectUrl.searchParams.set("redirect_uri", url.origin + "/api/callback");
    redirectUrl.searchParams.set("scope", "public_repo user");
    redirectUrl.searchParams.set("state", crypto.randomUUID());
    return Response.redirect(redirectUrl.href, 302);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

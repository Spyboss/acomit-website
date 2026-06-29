export async function onRequest(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const redirectUri = url.origin + "/api/callback";
    const state = crypto.randomUUID();

    const githubUrl = new URL("https://github.com/login/oauth/authorize");
    githubUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    githubUrl.searchParams.set("redirect_uri", redirectUri);
    githubUrl.searchParams.set("scope", "public_repo user");
    githubUrl.searchParams.set("state", state);

    const html = `<!DOCTYPE html>
<html>
<body>
<script>
  window.location.href = ${JSON.stringify(githubUrl.href)};
</script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html",
        "cross-origin-opener-policy": "unsafe-none",
      },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

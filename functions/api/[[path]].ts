const GITHUB_API = "https://api.github.com";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/", "");

  // Auth endpoint - returns a page that sends the token to the CMS popup
  if (path === "auth") {
    return new Response(
      `<!DOCTYPE html>
<html>
<body>
  <script>
    (function() {
      function receiveMessage(message) {
        window.opener.postMessage(
          { type: 'authorization', data: { token: '${env.GITHUB_PAT}' } },
          '*'
        );
        window.close();
      }
      receiveMessage();
    })();
  </script>
</body>
</html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // GitHub API proxy - forwards requests with the PAT
  if (path.startsWith("github")) {
    const apiPath = path.replace("github/", "");
    const method = request.method;
    const body = method !== "GET" && method !== "HEAD" ? await request.text() : null;

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${env.GITHUB_PAT}`);
    headers.set("Accept", "application/vnd.github.v3+json");
    headers.delete("host");

    const apiUrl = apiPath
      ? `${GITHUB_API}/${apiPath}${url.search}`
      : `${GITHUB_API}${url.search}`;

    const proxyReq = new Request(apiUrl, {
      method,
      headers,
      body,
    });

    const res = await fetch(proxyReq);
    const resHeaders = new Headers(res.headers);
    resHeaders.set("access-control-allow-origin", "*");

    return new Response(res.body, {
      status: res.status,
      headers: resHeaders,
    });
  }

  return new Response("Not found", { status: 404 });
}

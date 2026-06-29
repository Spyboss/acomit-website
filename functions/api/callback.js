export async function onRequest(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("Missing code parameter", { status: 400 });
    }

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
        redirect_uri: url.origin + "/api/callback",
      }),
    });

    const result = await res.json();

    const headers = {
      "content-type": "text/html",
      "cross-origin-opener-policy": "unsafe-none",
    };

    if (result.error) {
      return new Response(htmlForError(result), {
        headers,
        status: 401,
      });
    }

    return new Response(htmlForSuccess(result.access_token), {
      headers,
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

function htmlForSuccess(token) {
  const message = JSON.stringify({ token, provider: "github" });
  return `<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    try {
      if (window.opener) {
        window.opener.postMessage('authorization:github:success:${message}', '*');
        window.close();
      } else {
        document.body.textContent = 'Opener not found. Token: ${token}';
      }
    } catch(e) {
      document.body.textContent = 'Error: ' + e.message;
    }
  })();
</script>
</body>
</html>`;
}

function htmlForError(result) {
  return `<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    if (window.opener) {
      window.opener.postMessage('authorization:github:error:${JSON.stringify(result)}', '*');
    }
    document.body.textContent = 'Auth error: ${result.error} - ${result.error_description || ""}';
  })();
</script>
</body>
</html>`;
}

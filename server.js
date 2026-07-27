const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3005;

const app = next({ dev, hostname, port });

app.prepare().then(() => {
  const handle = app.getRequestHandler();

  const server = createServer({ maxHeaderSize: 1048576 }, async (req, res) => {
    try {
      // Auto-sanitize bloated cookie headers (> 16KB) to prevent HTTP 431 and Next.js crashes
      if (req.headers.cookie && req.headers.cookie.length > 16384) {
        console.log(`[COOKIE SANITIZER] Oversized cookie detected (${req.headers.cookie.length} bytes). Automatically wiping bloated cookies...`);

        // Find all cookie names in header
        const rawCookies = req.headers.cookie.split(";");
        const expiredCookies = [];

        for (const cookie of rawCookies) {
          const parts = cookie.split("=");
          const cookieName = parts[0] ? parts[0].trim() : "";
          if (cookieName) {
            expiredCookies.push(`${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
          }
        }

        if (expiredCookies.length > 0) {
          res.setHeader("Set-Cookie", expiredCookies);
        }

        // Wipe cookie header in memory for this incoming request so Next.js receives a clean request
        req.headers.cookie = "";
      }

      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://localhost:${port} or http://127.0.0.1:${port}`);
  });
});

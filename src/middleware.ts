import { defineMiddleware } from "astro:middleware";

// Define protected routes that require "basic authentication"
// (only to put the pages behind a basic auth before you actually launch your application to the world)
const PROTECTED_ROUTES = ["/protected"];

// Basic credentials (in production, use environment variables)
const VALID_CREDENTIALS = {
  username: import.meta.env.BASIC_AUTH_USERNAME,
  password: import.meta.env.BASIC_AUTH_PASSWORD,
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  const pathname = new URL(url).pathname;

  // Check if the current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    route === "/" ? pathname === route : pathname.startsWith(route),
  );

  // For protected routes, check authentication
  if (isProtectedRoute) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      // Return 401 Unauthorized with WWW-Authenticate header
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
          "Content-Type": "text/plain",
        },
      });
    }

    // Extract and decode credentials
    const encodedCredentials = authHeader.substring(6);
    const decodedCredentials = atob(encodedCredentials);
    const [username, password] = decodedCredentials.split(":");

    // Validate credentials
    if (
      VALID_CREDENTIALS.username &&
      VALID_CREDENTIALS.password &&
      (username !== VALID_CREDENTIALS.username ||
        password !== VALID_CREDENTIALS.password)
    ) {
      return new Response("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
          "Content-Type": "text/plain",
        },
      });
    }
  }

  // Continue to the next middleware/route handler
  return next();
});

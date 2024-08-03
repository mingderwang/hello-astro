import type { APIRoute, APIContext } from "astro";
export const POST: APIRoute = (context: APIContext) => {
  return new Response(JSON.stringify(context));
};

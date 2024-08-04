// pages/[...slugs].ts
import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { testPlugIn } from "../plugin/testPlugIn";
import { cron } from "@elysiajs/cron";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { base64UrlEncode } from '../utils'

const plugin = <T extends string>(config: { prefix: T }) =>
  new Elysia({
    name: "my-plugin",
    seed: config,
  })
    .get(`${config.prefix}/api`, "hi API 🍔")
    .get(`${config.prefix}/hi`, () => "Hi")
    .state("counter", 0)
    .get("/log", ({ store }) => console.log(store));

const app = new Elysia()
  .use(
    plugin({
      prefix: "/v2",
    })
  )
  .get("/counter", ({ store }) => store.counter++)
  .get("passkey/challenge", () => {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const encoded = base64UrlEncode(challenge);

    return {
      text: encoded,
      challenge: challenge,
    };
  })
  .get("passkey/options", () => {
    const options = generateAuthenticationOptions({
      challenge: new Uint8Array(32), // Generate a secure random challenge
      allowCredentials: [
        {
          id: 'ming', // ID of the registered credential
          type: "public-key",
        },
      ],
      userVerification: "preferred",
    });
    return options;
  })
  .use(swagger())
  .use(testPlugIn)
  .patch(
    "/user/profile",
    ({ body, error }) => {
      if (body.age < 18) return error(400, "Oh no");

      if (body.name === "Nagisa") return error(418);

      return body;
    },
    {
      body: t.Object({
        name: t.String(),
        age: t.Number(),
      }),
    }
  )
  .use(
    cron({
      name: "heartbeat",
      pattern: "* 30 * * * *",
      run() {
        console.log("休息30分鐘" + new Date().toString());
      },
    })
  );

export type App = typeof app;

const handle = ({ request }: { request: Request }) => app.handle(request);

export const GET = handle;
export const POST = handle;
export const PATCH = handle;

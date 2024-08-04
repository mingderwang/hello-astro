// pages/[...slugs].ts
import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { testPlugIn } from "../plugin/testPlugIn";
import { cron } from "@elysiajs/cron";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { GenerateRegistrationOptionsOpts } from "@simplewebauthn/server";
import { base64UrlEncode } from '../utils'
const {
  ENABLE_CONFORMANCE,
  ENABLE_HTTPS,
  RP_ID = 'localhost',
} = process.env;
const rpID = RP_ID;
const username = 'ming';
const devices: any = [];
const opts: GenerateRegistrationOptionsOpts = {
  rpName: 'SimpleWebAuthn Example',
  rpID,
  userName: username,
  timeout: 60000,
  attestationType: 'none',
  /**
   * Passing in a user's list of already-registered authenticator IDs here prevents users from
   * registering the same device multiple times. The authenticator will simply throw an error in
   * the browser if it's asked to perform registration when one of these ID's already resides
   * on it.
   */
  excludeCredentials: devices.map((dev: any) => ({
    id: dev.credentialID,
    type: 'public-key',
    transports: dev.transports,
  })),
  authenticatorSelection: {
    residentKey: 'discouraged',
    /**
     * Wondering why user verification isn't required? See here:
     *
     * https://passkeys.dev/docs/use-cases/bootstrapping/#a-note-about-user-verification
     */
    userVerification: 'preferred',
  },
  /**
   * Support the two most common algorithms: ES256, and RS256
   */
  supportedAlgorithmIDs: [-7, -257],
  challenge: crypto.getRandomValues(new Uint8Array(32)) 
};

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
    const options = generateAuthenticationOptions(opts);
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

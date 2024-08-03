// pages/[...slugs].ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { testPlugIn } from '../plugin/testPlugIn'

const app = new Elysia()
    .use(swagger())
    .use(testPlugIn)
    .get('/api', 'hi 🍔')
    .patch(
        '/user/profile',
        ({ body, error }) => {
            if(body.age < 18) 
                return error(400, "Oh no")

            if(body.name === 'Nagisa')
                return error(418)

            return body
        },
        {
            body: t.Object({
                name: t.String(),
                age: t.Number()
            })
        }
    )

export type App = typeof app

const handle = ({ request }: { request: Request }) => 
   app.handle(request) 

export const GET = handle 
export const POST = handle 
export const PATCH = handle 

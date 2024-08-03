// pages/[...slugs].ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { testPlugIn } from '../plugin/testPlugIn'

const app = new Elysia()
    .use(swagger())
    .use(testPlugIn)
    .get('/api', () => 'hi')

const handle = ({ request }: { request: Request }) => 
   app.handle(request) 

export const GET = handle 
export const POST = handle 

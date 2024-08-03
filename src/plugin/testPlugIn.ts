import { Elysia } from 'elysia'

export const testPlugIn = new Elysia()
    .decorate('plugin', 'hi')
    .get('/plugin', ({ plugin }) => plugin)

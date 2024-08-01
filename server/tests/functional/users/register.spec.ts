import { test } from '@japa/runner'
import { ResponseStatus } from '@adonisjs/core/http'
test.group('Users Register', (group) => {
    group.setup(async () => {
        console.log('runs once before all the tests')
    })

    group.teardown(async () => {
        console.log('runs once after all the tests')
    })
    test('user1', async ({ client }) => {
        const response = await client.post('/auth/register').json({
            username: 'user1',
            email: 'user1@gmail.com',
            password: 'password',
        })
        response.assertStatus(ResponseStatus.InternalServerError)
    })

    test('user2', async ({ client }) => {
        const response = await client.post('/auth/register').json({
            username: 'user2',
            email: 'user2@gmail.com',
            password: 'password',
        })
        response.assertStatus(ResponseStatus.Created)
        response.assertBody({
            result: true,
            message: 'User registered successfully',
        })
    })
})

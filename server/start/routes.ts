/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { UserRoles } from '#enums/user'
const UsersController = () => import('#controllers/users_controller')

router.where('id', {
    match: /^[0-9]+$/,
    cast: (id) => Number(id),
})

router
    .group(() => {
        router
            .group(() => {
                router.post('/register', [AuthController, 'register'])
                router.post('/login', [AuthController, 'login'])
                router
                    .post('/refresh', [AuthController, 'refresh'])
                    .use(middleware.auth({ guards: ['api'] }))
            })
            .prefix('/auth')
        router
            .group(() => {
                router.patch('/avatar', [UsersController, 'updateAvatar'])
            })
            .prefix('/users')
            .use([middleware.auth({ guards: ['api'] }), middleware.role({ role: UserRoles.USER })])
    })
    .prefix('/api/v1')

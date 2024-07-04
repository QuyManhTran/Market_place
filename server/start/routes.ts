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
const ProductsController = () => import('#controllers/products_controller')
const StoresController = () => import('#controllers/stores_controller')
const UsersController = () => import('#controllers/users_controller')

router.where('id', {
    match: /^[0-9]+$/,
    cast: (id) => Number(id),
})

router.where('store_id', {
    match: /^[0-9]+$/,
    cast: (id) => Number(id),
})

router
    .group(() => {
        /**
         * Auth routes
         */
        router
            .group(() => {
                router.post('/register', [AuthController, 'register'])
                router.post('/login', [AuthController, 'login'])
                router
                    .post('/refresh', [AuthController, 'refresh'])
                    .use(middleware.auth({ guards: ['api'] }))
            })
            .prefix('/auth')
        /**
         * User routes
         */
        router
            .group(() => {
                router
                    .group(() => {
                        router.patch('/profile', [UsersController, 'updateProfile'])
                        router.patch('/image', [UsersController, 'updateImage'])
                    })
                    .prefix('/edit')
            })
            .prefix('/users')
            .use([
                middleware.auth({ guards: ['api'] }),
                middleware.role({ roles: [UserRoles.USER] }),
            ])
        /**
         * Store routes
         */
        router
            .resource('stores', StoresController)
            .use(
                ['store'],
                [middleware.auth({ guards: ['api'] }), middleware.role({ roles: [UserRoles.USER] })]
            )
            .use(
                ['update'],
                [
                    middleware.auth({ guards: ['api'] }),
                    middleware.role({ roles: [UserRoles.SELLER] }),
                ]
            )

        /**
         * Product routes
         */
        router
            .resource('stores.products', ProductsController)
            .use(
                ['store', 'update'],
                [
                    middleware.auth({ guards: ['api'] }),
                    middleware.role({ roles: [UserRoles.SELLER] }),
                ]
            )
    })
    .prefix('/api/v1')

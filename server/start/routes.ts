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
const OrdersController = () => import('#controllers/orders_controller')
const CartsController = () => import('#controllers/carts_controller')
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
                router.post('/refresh', [AuthController, 'refresh'])
                router
                    .delete('/logout', [AuthController, 'logout'])
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
                        router.post('/topup', [UsersController, 'topUp'])
                    })
                    .prefix('/edit')
                router.get('/search', [UsersController, 'search']).use(middleware.pagination())
                router.get('/my-store', [UsersController, 'getMyStore'])
            })
            .prefix('/users')
            .use([
                middleware.auth({ guards: ['api'] }),
                middleware.role({ roles: [UserRoles.USER, UserRoles.SELLER] }),
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
            .use(
                ['index'],
                [
                    middleware.auth({ guards: ['api'] }),
                    middleware.role({ roles: [UserRoles.USER, UserRoles.SELLER] }),
                    middleware.pagination(),
                ]
            )
            .use('show', [
                middleware.auth({ guards: ['api'] }),
                middleware.role({ roles: [UserRoles.USER, UserRoles.SELLER] }),
            ])

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
            .use(['index'], [middleware.pagination()])
            .use(
                ['show'],
                [
                    middleware.auth({ guards: ['api'] }),
                    middleware.role({ roles: [UserRoles.USER, UserRoles.SELLER] }),
                ]
            )
            .use(
                ['create', 'destroy'],
                [
                    middleware.auth({ guards: ['api'] }),
                    middleware.role({ roles: [UserRoles.SELLER] }),
                    middleware.pagination(),
                ]
            )

        /**
         * Cart routes
         */

        router
            .resource('users.carts', CartsController)
            .use(
                ['index', 'store', 'destroy'],
                [
                    middleware.auth({ guards: ['api'] }),
                    middleware.role({ roles: [UserRoles.USER, UserRoles.SELLER] }),
                ]
            )
            .where('user_id', {
                match: /^[0-9]+$/,
                cast: (id) => Number(id),
            })

        /**
         * Order routes
         */

        router
            .resource('users.orders', OrdersController)
            .use(
                ['index', 'store', 'show'],
                [
                    middleware.auth({ guards: ['api'] }),
                    middleware.role({ roles: [UserRoles.USER, UserRoles.SELLER] }),
                ]
            )
    })
    .prefix('/api/v1')

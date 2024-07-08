import { UserRoles } from '#enums/user'
import Store from '#models/store'
import User from '#models/user'
import { Pagination, PaginationMeta } from '#types/pagination'
import { CreateStore, UpdateStore } from '#types/store'
import { Exception } from '@adonisjs/core/exceptions'

export default class StoreService {
    async store({ description, storeName }: CreateStore, user: User) {
        await user
            .merge({
                role: UserRoles.SELLER,
            })
            .save()
        const store = await user.related('store').create({
            description,
            storeName,
        })

        return {
            result: true,
            data: {
                store,
            },
        }
    }

    async update({ description, storeName }: UpdateStore, user: User, storeId: number) {
        console.log('storeid', storeId)
        console.log('userId', user.id)
        const store: Store = await Store.findByOrFail({ id: storeId, sellerId: user.id })
        if (storeName) store.storeName = storeName
        if (description) store.description = description
        await store.save()
        return {
            result: true,
            data: {
                store,
            },
        }
    }

    async show(storeId: number) {
        const store = await Store.query()
            .where('id', storeId)
            .preload('products', (builder) => {
                builder.preload('image')
            })
            .first()
        if (!store) {
            throw new Exception('Store not found', {
                code: 'E_NOT_FOUND',
                status: 404,
            })
        }
        return {
            result: true,
            data: {
                store,
            },
        }
    }

    async index(pagination: Pagination) {
        const stores = await Store.query()
            .preload('products', (builder) => {
                builder.preload('image')
            })
            .paginate(pagination.curPage, pagination.perPage)

        const meta: PaginationMeta = {
            total: stores.getMeta().total,
            perPage: stores.getMeta().perPage,
            currentPage: stores.getMeta().currentPage,
            lastPage: stores.getMeta().lastPage,
            firstPage: stores.getMeta().firstPage,
        }
        return {
            result: true,
            data: {
                stores: {
                    meta,
                    data: stores.all(),
                },
            },
        }
    }
}

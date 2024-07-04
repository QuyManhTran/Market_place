import { UserRoles } from '#enums/user'
import Store from '#models/store'
import User from '#models/user'
import { CreateStore, UpdateStore } from '#types/store'

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
}

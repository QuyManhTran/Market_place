import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Cart from './cart.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class CartItem extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'cart_id' })
    declare cartId: number

    @column({ columnName: 'product_id' })
    declare productId: number

    @column.dateTime({ autoCreate: true, serializeAs: null })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
    declare updatedAt: DateTime

    @belongsTo(() => Cart)
    declare cart: BelongsTo<typeof Cart>

    @belongsTo(() => Product, {
        foreignKey: 'productId',
        localKey: 'id',
    })
    declare product: BelongsTo<typeof Product>
}

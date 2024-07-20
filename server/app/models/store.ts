import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class Store extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'seller_id' })
    declare sellerId: number

    @column({ columnName: 'store_name' })
    declare storeName: string

    @column()
    declare description: string

    @column.dateTime({ autoCreate: true, serializeAs: null })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
    declare updatedAt: DateTime

    @belongsTo(() => User, {
        localKey: 'id',
        foreignKey: 'sellerId',
    })
    declare seller: BelongsTo<typeof User>

    @hasMany(() => Product, {
        localKey: 'id',
        foreignKey: 'storeId',
    })
    declare products: HasMany<typeof Product>
}

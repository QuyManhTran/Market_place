import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import { ProductStatus } from '#enums/product'
import Store from './store.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import ProductImage from './product_image.js'

export default class Product extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'store_id' })
    declare storeId: number

    @column()
    declare name: string

    @column()
    declare description: string

    @column()
    declare price: number

    @column()
    declare status: ProductStatus

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => Store)
    declare store: BelongsTo<typeof Store>

    @hasOne(() => ProductImage, {
        localKey: 'id',
        foreignKey: 'productId',
    })
    declare image: HasOne<typeof ProductImage>
}

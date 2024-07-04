import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProductImage extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'product_id', serializeAs: null })
    declare productId: number

    @column()
    declare url: string

    @column({ columnName: 'public_id' })
    declare publicId: string

    @column.dateTime({ autoCreate: true, serializeAs: null })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
    declare updatedAt: DateTime

    @belongsTo(() => Product)
    declare product: BelongsTo<typeof Product>
}

import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import OrderItem from './order_item.js'
import Payment from './payment.js'

export default class Order extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'user_id' })
    declare userId: number

    @column()
    declare total: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @hasMany(() => OrderItem, {
        localKey: 'id',
        foreignKey: 'orderId',
    })
    declare items: HasMany<typeof OrderItem>

    @hasOne(() => Payment, {
        localKey: 'id',
        foreignKey: 'orderId',
    })
    declare payment: HasOne<typeof Payment>
}

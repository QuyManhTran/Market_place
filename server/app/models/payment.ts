import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { PaymentStatus } from '#enums/order'
import Order from './order.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Payment extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'order_id' })
    declare orderId: number

    @column()
    declare amount: number

    @column()
    declare status: PaymentStatus

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => Order)
    declare order: BelongsTo<typeof Order>
}

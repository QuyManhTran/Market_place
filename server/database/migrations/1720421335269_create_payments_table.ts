import { PaymentStatus } from '#enums/order'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'payments'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('order_id')
                .unsigned()
                .references('id')
                .inTable('orders')
                .onDelete('CASCADE')
            table.double('amount').notNullable()
            table
                .enum('status', Object.values(PaymentStatus))
                .notNullable()
                .defaultTo(PaymentStatus.SUCCESS)

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}

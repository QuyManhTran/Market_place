import { ProductStatus } from '#enums/product'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'products'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('store_id')
                .unsigned()
                .references('id')
                .inTable('stores')
                .onDelete('CASCADE')
            table.string('name').notNullable()
            table.string('description').notNullable()
            table.double('price').notNullable().defaultTo(0)
            table
                .enum('status', Object.values(ProductStatus))
                .notNullable()
                .defaultTo(ProductStatus.INACTIVE)

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}

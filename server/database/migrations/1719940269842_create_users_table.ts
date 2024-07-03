import { UserRoles } from '#enums/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'users'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable().primary()
            table.string('user_name').nullable()
            table.string('email', 254).notNullable().unique()
            table.string('password').notNullable()
            table.enum('role', Object.values(UserRoles)).notNullable().defaultTo(UserRoles.USER)
            table.double('balance').notNullable().defaultTo(0)

            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}

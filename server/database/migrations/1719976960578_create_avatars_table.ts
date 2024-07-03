import { UserImages } from '#constants/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'avatars'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('profile_id')
                .unsigned()
                .references('id')
                .inTable('profiles')
                .onDelete('CASCADE')
            table.string('url').notNullable().defaultTo(UserImages.AVATAR)
            table.string('public_id').nullable()
            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}

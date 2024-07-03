import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Avatar from './avatar.js'
import Background from './background.js'

export default class Profile extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'user_id' })
    declare userId: number

    @column()
    declare age: number | null

    @column()
    declare address: string | null

    @column({ columnName: 'phone_number' })
    declare phoneNumber: string | null

    @column.dateTime({ autoCreate: true, serializeAs: null })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
    declare updatedAt: DateTime

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @hasOne(() => Avatar, {
        localKey: 'id',
        foreignKey: 'profileId',
    })
    declare avatar: HasOne<typeof Avatar>

    @hasOne(() => Background, {
        localKey: 'id',
        foreignKey: 'profileId',
    })
    declare background: HasOne<typeof Background>
}

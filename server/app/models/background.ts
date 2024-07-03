import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Profile from './profile.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Background extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'profile_id' })
    declare profileId: number

    @column()
    declare url: string

    @column({ columnName: 'public_id', serializeAs: null })
    declare publicId: string | null

    @column.dateTime({ autoCreate: true, serializeAs: null })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
    declare updatedAt: DateTime

    @belongsTo(() => Profile)
    declare profile: BelongsTo<typeof Profile>
}

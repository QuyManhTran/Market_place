import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
// import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { JwtAccessTokenProvider, JwtSecret } from '#providers/jwt_access_token_provider'
import parseDuration from 'parse-duration'
import { JwtExpiration } from '#enums/jwt'
import { UserRoles } from '#enums/user'
import env from '#start/env'
import Profile from './profile.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Store from './store.js'
import Cart from './cart.js'
import Order from './order.js'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
    @column({ isPrimary: true })
    declare id: number

    @column({ columnName: 'user_name' })
    declare username: string

    @column()
    declare email: string

    @column({ serializeAs: null })
    declare password: string

    @column()
    declare role: UserRoles

    @column()
    declare balance: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @hasOne(() => Profile, {
        localKey: 'id',
        foreignKey: 'userId',
    })
    declare profile: HasOne<typeof Profile>

    @hasOne(() => Store, {
        localKey: 'id',
        foreignKey: 'sellerId',
        serializeAs: 'store',
    })
    declare store: HasOne<typeof Store>

    @hasOne(() => Cart, {
        localKey: 'id',
        foreignKey: 'userId',
    })
    declare cart: HasOne<typeof Cart>

    @hasMany(() => Order, {
        localKey: 'id',
        foreignKey: 'userId',
    })
    declare orders: HasMany<typeof Order>

    static accessTokens = JwtAccessTokenProvider.forModel(User, {
        expiresInMillis: parseDuration(JwtExpiration.ACCESS)!,
        refreshExpiresInMillis: parseDuration(JwtExpiration.REFRESH)!,
        key: new JwtSecret(env.get('JWT_ACCESS_SECRET'), env.get('JWT_REFRESH_SECRET')),
        primaryKey: 'id',
        algorithm: 'HS256',
        audience: 'https://client.example.com',
        issuer: 'https://server.example.com',
    })
}

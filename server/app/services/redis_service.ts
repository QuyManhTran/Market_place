import redis from '@adonisjs/redis/services/main'

export default class RedisService {
    async get(key: string, resultQueryCB: () => Promise<any>) {
        const value = await redis.get(key)
        if (!value) {
            // console.log('Cache miss')
            const result = await resultQueryCB()
            await redis.setex(key, 60, JSON.stringify(result))
            return result
        }
        // console.log('Cache hit')
        return JSON.parse(value)
    }
}

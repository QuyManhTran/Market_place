import redis from '@adonisjs/redis/services/main'

export default class RedisService {
    async get(key: string, resultQueryCB: () => Promise<any>, seconds: number = 60) {
        const value = await redis.get(key)
        if (!value) {
            // //console.log('Cache miss')
            const result = await resultQueryCB()
            await redis.set(key, JSON.stringify(result), 'EX', seconds, 'NX')
            return result
        }
        // //console.log('Cache hit')
        return JSON.parse(value)
    }
}

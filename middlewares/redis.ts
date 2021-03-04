import Redis from 'ioredis'
import IORedis from 'ioredis'
import {NextFunction, Request, Response} from 'express'

const REDIS_ON: boolean = process.env.REDIS_ON === 'true'
const REDIS_URL: string = process.env.REDIS_URL || 'redis://:password@localhost:6379/0'
const REDIS_EXPIRES: number = Number(process.env.REDIS_EXPIRES) || 3600

let redis: IORedis.Redis
if (REDIS_ON) {
    redis = new Redis(REDIS_URL)
}

export enum RedisKeys {
    USERS = 'USERS'
}

export type TRedisKeys = keyof typeof RedisKeys | string

function isConnected() {
    return REDIS_ON && redis?.status === 'ready'
}

// Добавляем мета данные в заголовки
const setHeaderMeta = (res: Response): void => {
    res.setHeader('Cache', 'redis')
}

export const generateKeyByPrefix = (key: TRedisKeys, prefix: string): string => {
    return `${key}:${prefix}`
}

export const getCacheValueByKey = async <T>(key: TRedisKeys): Promise<T | null> => {
    if (!isConnected()) {
        return null
    }
    try {
        const result = await redis.get(key)
        if (result) {
            return JSON.parse(result)
        }
        return null
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getCache = (key: TRedisKeys) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!isConnected()) {
            return next()
        }

        let result: string | null
        try {
            result = await redis.get(key)
            if (!result) {
                return next()
            }
            setHeaderMeta(res)
            res.json(JSON.parse(result))
        } catch (error) {
            console.error(error)
            return next()
        }
    }

// Устанавливаем кэш на 3600сек.=1ч
export const setCache = async (key: TRedisKeys, result: any, seconds: number = REDIS_EXPIRES): Promise<void> => {
    if (!isConnected()) {
        return
    }
    try {
        await redis.setex(key, seconds, JSON.stringify(result))
    } catch (error) {
        console.error(error)
    }
}

export const clearCacheByKey = async (key: TRedisKeys): Promise<void> => {
    if (!isConnected()) {
        return
    }
    try {
        await redis.del(key)
    } catch (error) {
        console.error(error)
    }
}

export const clearCache = (cacheKeys?: Set<TRedisKeys>): void => {
    cacheKeys?.forEach(item => clearCacheByKey(item).then())
}
import {clearCacheByKey, getCacheValueByKey, RedisKeys, setCache} from '../middlewares/redis'
import {Request, Response} from 'express'

interface IUser {
    first_name: string
    last_name: string
    patronymic: string
}

class UserController {
    getAll = (req: Request, res: Response): void => {
        res.json({message: 'Пользователей пока нет, добавьте пользователей!'})
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const {first_name, last_name, patronymic}: IUser = req.body
        const data = {
            first_name, last_name, patronymic
        }
        const users = await getCacheValueByKey<IUser[]>(RedisKeys.USERS)
        let arrUsers: IUser[]
        if (users) {
            arrUsers = [...users, data]
        } else {
            arrUsers = [data]
        }
        await setCache(RedisKeys.USERS, arrUsers)
        res.json(data)
    }

    destroy = async (req: Request, res: Response): Promise<void> => {
        await clearCacheByKey(RedisKeys.USERS)
        res.json('ОК')
    }
}

export default new UserController()
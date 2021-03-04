import express from 'express'
import {getCache, RedisKeys} from '../middlewares/redis'
import UserController from '../controllers/userController'

const router = express.Router()

router.get('/', getCache(RedisKeys.USERS), UserController.getAll)
router.post('/', UserController.create)
router.post('/destroy', UserController.destroy)

export default router
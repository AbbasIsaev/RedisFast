import express, {NextFunction, Request, Response} from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRouter from './routes'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.render('index', {title: 'Express'})
})
app.use('/api', indexRouter)

export default app
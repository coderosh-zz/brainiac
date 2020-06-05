import express from 'express'
import path from 'path'
import session from 'express-session'

import connectToDatabase from './config/db'
import socketio from './socket'

import appRouter from './routes/app'
import authRouter from './routes/auth'

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(
	session({
		secret: process.env.SESSION_SECRET || 'secret',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
)

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session!.isLoggedIn
	res.locals.user = req.session!.user
	next()
})

app.use('/auth', authRouter)
app.use(appRouter)

const PORT = process.env.PORT || 8080

connectToDatabase()
	.then(() => {
		const server = app.listen(PORT, () => {
			console.log(`Server started on port on ${PORT}`)
		})
		const io = socketio.init(server)
	})
	.catch(() => {
		process.exit()
	})

import { Router, Request, Response, NextFunction } from 'express'
import {
	getHome,
	getService,
	postService,
	getHelp,
	postHelp,
	getPatient,
	getAmbulance,
} from '../controllers/app'
import isAuth from '../middlewares/auth'

const router = Router()

const isUser = (req: Request, res: Response, next: NextFunction) => {
	if (req.session!.user.role !== 'user') {
		return res.redirect('/')
	}
	next()
}

const isServiceProvider = (req: Request, res: Response, next: NextFunction) => {
	if (req.session!.user.role !== 'service') {
		return res.redirect('/')
	}
	next()
}

router.get('/', getHome)

router
	.route('/service')
	.get(isAuth, isServiceProvider, getService)
	.post(isAuth, isServiceProvider, postService)

router
	.route('/help')
	.get(isAuth, isUser, getHelp)
	.post(isAuth, isUser, postHelp)

router.route('/patient/:id').get(isAuth, isServiceProvider, getPatient)

router.route('/ambulance/:id').get(isAuth, isUser, getAmbulance)

export default router

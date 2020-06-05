import { Router, Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'

import {
	getLogin,
	getSignup,
	postSignup,
	postLogin,
	postLogout,
} from '../controllers/auth'

const router = Router()

const shouldNotBeLoggedIn = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.session!.isLoggedIn) {
		return res.redirect('/')
	}
	next()
}

router
	.route('/login')
	.get(shouldNotBeLoggedIn, getLogin)
	.post(
		[
			check('email')
				.isEmail()
				.withMessage('Please provide valid email address'),
			check('password').notEmpty().withMessage('Please provide password'),
			check('location').notEmpty(),
		],
		postLogin
	)

router
	.route('/signup')
	.get(shouldNotBeLoggedIn, getSignup)
	.post(
		[
			check('email')
				.isEmail()
				.withMessage('Please provide valid email address'),
			check('password').notEmpty().withMessage('Please provide password'),
			check('name').notEmpty().withMessage('Please provide name'),
		],
		postSignup
	)

router.post('/logout', postLogout)

export default router

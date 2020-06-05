import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { hash, compare } from 'bcryptjs'

import User from '../models/User'

const getLogin = (req: Request, res: Response, next: NextFunction) => {
	res.render('auth/login', {
		path: '/auth/login',
		pageTitle: 'Login',
		errors: [],
		oldInput: {
			email: '',
			password: '',
		},
	})
}

const getSignup = (req: Request, res: Response, next: NextFunction) => {
	res.render('auth/signup', {
		path: '/auth/signup',
		pageTitle: 'Signup',
		errors: [],
		oldInput: {
			email: '',
			password: '',
			name: '',
		},
	})
}

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const errors = validationResult(req)
		const errArray = errors.array()

		let errs: any = {}

		for (let i = 0; i < errArray.length; i++) {
			const key: string = errArray[i].param
			errs[key] = errArray[i].msg
		}

		const { email, password, location } = req.body
		const userLocation = JSON.parse(location)

		if (!errors.isEmpty()) {
			return res.render('auth/login', {
				path: '/auth/login',
				pageTitle: 'Login',
				errors: errs,
				oldInput: {
					email,
					password,
				},
			})
		}

		const user = await User.findOne({ email })

		if (!user) {
			return res.render('auth/login', {
				path: '/auth/login',
				pageTitle: 'Login',
				errors: { email: 'Email not registered' },
				oldInput: {
					email,
					password,
				},
			})
		}

		const passwordMatch = await compare(password, user.password)

		if (!passwordMatch) {
			return res.render('auth/login', {
				path: '/auth/login',
				pageTitle: 'Login',
				errors: { password: 'Incorrect Password' },
				oldInput: {
					email,
					password,
				},
			})
		}

		user.location = {
			type: 'Point',
			coordinates: [userLocation.longitude, userLocation.latitude],
		}

		const updatedUser = await user.save()

		req.session!.isLoggedIn = true
		req.session!.user = updatedUser
		req.session!.save((err) => {
			res.redirect('/')
		})
	} catch (e) {
		console.log(e)
		res.redirect('/auth/login')
	}
}

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req)
	const errArray = errors.array()

	let errs: any = {}

	for (let i = 0; i < errArray.length; i++) {
		const key: string = errArray[i].param
		errs[key] = errArray[i].msg
	}

	const { email, password, name } = req.body

	if (!errors.isEmpty()) {
		return res.render('auth/signup', {
			path: '/auth/signup',
			pageTitle: 'Signup',
			errors: errs,
			oldInput: {
				email,
				password,
				name,
			},
		})
	}

	try {
		const hashedPassword = await hash(password, 10)

		const user = await User.findOne({ email })

		if (user) {
			return res.render('auth/signup', {
				path: '/auth/signup',
				pageTitle: 'Signup',
				errors: { email: 'Duplicate email found' },
				oldInput: {
					email,
					password,
					name,
				},
			})
		}

		const location = {
			type: 'Point',
			coordinates: [0, 0],
		}

		await User.create({
			name,
			email,
			password: hashedPassword,
			role: 'user',
			location,
		})
	} catch (e) {
		return res.redirect('/auth/signup')
	}
	res.redirect('/auth/login')
}

const postLogout = (req: Request, res: Response, next: NextFunction) => {
	req.session!.destroy((err) => {
		res.redirect('/')
	})
}

export { getLogin, getSignup, postLogin, postSignup, postLogout }

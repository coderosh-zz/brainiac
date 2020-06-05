import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import Ambulance from '../models/Ambulance'
import User from '../models/User'

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const ambulances = await Ambulance.find().populate('user')
		res.render('admin', {
			pageTitle: 'Admin',
			path: '/admin',
			ambulances,
		})
	} catch (e) {
		res.redirect('/admin')
	}
}

const getAddAmbulance = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const users = await User.find({ role: 'user' })

	res.render('addambulance', {
		pageTitle: 'Add Ambulance',
		path: '/addambulance',
		errors: [],
		allUsers: users,
		oldInput: {
			name: '',
		},
	})
}

const postAddAmbulance = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req)
		const errArray = errors.array()

		let errs: any = {}
		for (let i = 0; i < errArray.length; i++) {
			const key: string = errArray[i].param
			errs[key] = errArray[i].msg
		}

		const { user, name } = req.body

		const users = await User.find({ role: 'user' })

		if (!errors.isEmpty()) {
			return res.render('addambulance', {
				pageTitle: 'Add Ambulance',
				path: '/addambulance',
				errors: errs,
				allUsers: users,
				oldInput: {
					name,
				},
			})
		}

		const userExists = await User.findById(user)

		if (!userExists) {
			return res.render('addambulance', {
				pageTitle: 'Add Ambulance',
				path: '/addambulance',
				errors: { user: 'Please provide valid user' },
				allUsers: users,
				oldInput: {
					name,
				},
			})
		}

		const ambulanceExists = await Ambulance.findOne({ name })

		if (ambulanceExists) {
			return res.render('addambulance', {
				pageTitle: 'Add Ambulance',
				path: '/addambulance',
				errors: { name: 'Ambulance with this name already exists' },
				allUsers: users,
				oldInput: {
					name,
				},
			})
		}

		await Ambulance.create({ name, user: user })
		userExists.role = 'service'
		await userExists.save()
		res.redirect('/admin')
	} catch (e) {
		res.redirect('/admin')
	}
}

export { getAdmin, postAddAmbulance, getAddAmbulance }

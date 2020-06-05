import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import Ambulance from '../models/Ambulance'
import Help from '../models/Help'
import socketio from '../socket'
import geocoder from '../utils/geocoder'

const getHome = (req: Request, res: Response, next: NextFunction) => {
	res.render('home', {
		pageTitle: 'Home',
		path: '/',
	})
}

const getService = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const ambulance = await Ambulance.findOne({ user: req.session!.user._id })
		if (!ambulance) {
			return res.redirect('/')
		}

		const help = await Help.findOne({
			ambulance: ambulance.id,
		}).populate('user')

		let formatted: any = []
		if (help) {
			formatted = await geocoder.reverse({
				lon: help.user.location.coordinates[0],
				lat: help.user.location.coordinates[1],
			})
		}

		res.render('service', {
			pageTitle: 'Service',
			path: '/service',
			ambulance,
			formatted: formatted[0],
			help: help || undefined,
		})
	} catch (e) {
		res.redirect('/')
	}
}

const postService = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, available } = req.body

		const ambulance = await Ambulance.findOne({ user: req.session!.user._id })

		if (!ambulance) {
			return res.redirect('/service')
		}

		await Help.deleteMany({ ambulance: ambulance.id })

		ambulance.name = name
		ambulance.available = available === 'on'

		await ambulance.save()

		res.redirect('/service')
	} catch (e) {
		res.redirect('/service')
	}
}

const getHelp = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const ambulances = await Ambulance.find({ available: true }).populate(
			'user'
		)
		res.render('help', {
			path: '/help',
			pageTitle: 'Help',
			ambulances,
		})
	} catch (e) {
		console.log(e)
		res.redirect('/')
	}
}

const postHelp = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const email = req.body.email
		if (!email) {
			return res.redirect('/help')
		}

		const user = await User.findOne({ email })

		if (!user) {
			return res.redirect('/help')
		}

		const ambulance = await Ambulance.findOne({
			user: user.id,
			available: true,
		}).populate('user')

		if (!ambulance) {
			return res.redirect('/help')
		}

		ambulance.available = false
		await ambulance.save()

		await Help.create({
			user: req.session!.user._id,
			ambulance: ambulance.id,
		})

		const patHeath = await Help.findOne({ ambulance: ambulance.id }).populate(
			'user'
		)

		if (!patHeath) return

		let formatted = await geocoder.reverse({
			lon: patHeath.user.location.coordinates[0],
			lat: patHeath.user.location.coordinates[1],
		})

		socketio
			.getIo()
			.emit('help', { ambulance, user: patHeath.user, formatted: formatted[0] })

		res.redirect(`/ambulance/${ambulance.id}`)
	} catch (e) {
		res.redirect('/')
	}
}

const getPatient = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const patient = await User.findById(req.params.id)

		if (!patient) {
			return res.redirect('/')
		}

		res.render('patient', {
			pageTitle: 'Map',
			path: '/patient',
			patient,
		})
	} catch (e) {
		res.redirect('/')
	}
}

const getAmbulance = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const ambulance = await Ambulance.findById(req.params.id).populate('user')

		if (!ambulance) {
			return res.redirect('/')
		}

		res.render('ambulance', {
			pageTitle: 'Map',
			path: '/ambulance',
			ambulance,
		})
	} catch (e) {
		res.redirect('/')
	}
}

export {
	getHome,
	getService,
	postService,
	getHelp,
	postHelp,
	getPatient,
	getAmbulance,
}

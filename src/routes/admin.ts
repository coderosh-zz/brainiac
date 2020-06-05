import { Router } from 'express'
import { check } from 'express-validator'

import {
	getAdmin,
	postAddAmbulance,
	getAddAmbulance,
} from '../controllers/admin'

const router = Router()

router.get('/', getAdmin)

router
	.route('/addambulance')
	.post(
		[
			check('name').notEmpty().withMessage('Please provide name'),
			check('user').notEmpty().withMessage('Please select user'),
		],
		postAddAmbulance
	)
	.get(getAddAmbulance)

export default router

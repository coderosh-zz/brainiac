import { Router } from 'express'
import { getHome } from '../controllers/app'

const router = Router()

router.get('/', getHome)

export default router

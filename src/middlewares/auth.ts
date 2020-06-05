import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
	if (!req.session || !req.session.isLoggedIn || !req.session.user) {
		return res.redirect('/auth/login')
	}
	next()
}

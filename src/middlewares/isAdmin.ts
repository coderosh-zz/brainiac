import { Response, Request, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
	if (req.session!.user.role !== 'admin') {
		return res.redirect('/')
	}

	res.locals.user = req.session!.user
	next()
}

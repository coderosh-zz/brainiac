import { Schema, Document, model, Model } from 'mongoose'

interface IUser extends Document {
	name: string
	email: string
	password: string
	role: string
	location: any
}

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			required: true,
			trim: true,
		},
		location: {
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number],
				index: '2dsphere',
			},
		},
	},
	{
		timestamps: true,
	}
)

const UserModel: Model<IUser> = model<IUser>('User', UserSchema)

export default UserModel

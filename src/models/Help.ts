import { Document, model, Model, Schema } from 'mongoose'

interface IHelp extends Document {
	user: any
	ambulance: any
}

const helpSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		ambulance: {
			type: Schema.Types.ObjectId,
			ref: 'Ambulance',
		},
	},
	{
		timestamps: true,
	}
)

const helpModel: Model<IHelp> = model<IHelp>('Help', helpSchema)

export default helpModel

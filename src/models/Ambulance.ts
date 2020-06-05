import { Schema, Model, model, Document } from 'mongoose'

interface IAmbulance extends Document {
	name: string
	user: any
	available?: boolean
}

const ambulanceSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		available: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

const ambulanceModel: Model<IAmbulance> = model<IAmbulance>(
	'Ambulance',
	ambulanceSchema
)

export default ambulanceModel

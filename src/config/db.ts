import { connect, ConnectionOptions } from 'mongoose'

const mongoURI =
	process.env.MONGO_URI || 'mongodb://localhost:27017/sagarmathaHack'

const conectionOptions: ConnectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: true,
}

const connectToDatabase = async () => {
	const connection = await connect(mongoURI, conectionOptions)

	console.log(`MONGODB CONNECTED: `, connection.connection.host)
}

export default connectToDatabase

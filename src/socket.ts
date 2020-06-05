import socketio, { Server } from 'socket.io'

let io: Server

export default {
	init: (server: any) => {
		io = socketio(server)
		return io
	},
	getIo: () => io,
}

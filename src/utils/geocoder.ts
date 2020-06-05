import NodeGeocoder, { Options, Geocoder, Location } from 'node-geocoder'

const options: Options = {
	provider: 'mapquest',
	httpAdapter: 'https',
	apiKey: process.env.GEOCODER_KEY!,
}

const geocoder: Geocoder = NodeGeocoder(options)

export default geocoder

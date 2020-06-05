var map = new ol.Map({
	target: 'map',
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM(),
		}),
	],
	view: new ol.View({
		center: ol.proj.fromLonLat([85.2949395, 27.7281437]),
		zoom: 10,
	}),
})

var iconStyle = new ol.style.Style({
	image: new ol.style.Icon({
		anchor: [0.5, 40],
		anchorXUnits: 'fraction',
		anchorYUnits: 'pixels',
		src: 'https://img.icons8.com/plasticine/50/000000/ambulance.png',
	}),
})

const dotStyle = new ol.style.Style({
	image: new ol.style.Circle({
		radius: 7,
		fill: new ol.style.Fill({
			color: 'crimson',
		}),
		stroke: new ol.style.Stroke({
			color: '#000',
			width: 2,
		}),
	}),
})

const setMarker = (location, style, name) => {
	var marker = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.fromLonLat(location)),
		name,
	})
	marker.setStyle(style)

	var vectorSource = new ol.source.Vector({
		features: [marker],
	})
	var markerVectorLayer = new ol.layer.Vector({
		source: vectorSource,
	})
	map.addLayer(markerVectorLayer)
	return marker
}

map.on('click', function (evt) {
	var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
		return feature
	})
	if (feature) {
		// var coordinates = feature.getGeometry().getCoordinates()
		if (feature.get('name') === 'ME') return

		document.querySelector('.map-info').innerHTML = `
    <div class="item-info title">Ambulance Service - Brainiac</div>
    <div class="item-info">
        <table>
            <tr>
                <th>Ambulance</th>
                <td>${feature.get('name').ambName}</td>
            </tr>
            <tr>
                <th>Driver</th>
                <td>${feature.get('name').name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>${feature.get('name').email}</td>
            </tr>
            <tr>
                <th>Location</th>
                <td>${feature
									.get('name')
									.location[0].toFixed(8)}, ${feature
			.get('name')
			.location[1].toFixed(8)}</td>
            </tr>
        </table>
    </div>
    <div class="item-info">
      <form method="post" action="/help">
        <input type="hidden" name="email" value='${
					feature.get('name').email
				}' />
        <button class="auth-submit">Help</button>
      </form>
    </div>
    `
		document.querySelector('.map-info').style.display = 'block'
	} else {
		document.querySelector('.map-info').style.display = 'none'
	}
})

// const me = setMarker([85.2949276, 27.7281612], dotStyle)
// const driver = setMarker([85.2944276, 27.7281612], iconStyle)
// let long = 85.2949395
// let lat = 27.7281437
// marker1.getGeometry().setCoordinates(ol.proj.fromLonLat([long, lat]))

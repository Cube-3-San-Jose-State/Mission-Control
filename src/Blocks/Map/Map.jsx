import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import React, { Component, useRef } from 'react'


export default function LeafMap(lati, long) {
    return(
        <div id='map'>
        <MapContainer center={[37.3368484819453, -121.88194209629391]} 
						zoom={18} 
						scrollWheelZoom={false}>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://www.thunderforest.com/">ThunderForest</a> contributors'
								url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=87f83a1da5d54550ac58709022905087"
							/>
                            <Marker position={[37.3368484819453, -121.88194209629391]}></Marker>
        </MapContainer>
        </div>
    )
}
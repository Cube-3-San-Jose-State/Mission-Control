import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import React, { Component } from 'react'


export default function LeafMap() {
    return(
        <div id='map'>
        <MapContainer center={[37.774929, -122.419418]} 
						zoom={0} 
						scrollWheelZoom={false}>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{x}/{y}/{z}.png"
							/>
                            <Marker position={[37.774929, -122.419418]}></Marker>
        </MapContainer>
        </div>
    )
}
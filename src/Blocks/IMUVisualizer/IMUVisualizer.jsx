import React, { useState, useEffect } from 'react'
import AccelerometerGraph from './AccelerometerGraph.jsx'
import GyroscopeGraph from './GyroscopeGraph'

export default function IMUVisualizer(props) {
  return (
    <div>
        <AccelerometerGraph imu={props.imu} timestamp={props.timestamp}/>
        <GyroscopeGraph imu={props.imu} timestamp={props.timestamp}/>
    </div>
  )
}

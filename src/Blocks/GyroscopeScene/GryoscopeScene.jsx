import ReactDOM from 'react-dom'
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import PrettyData from '../PrettyData/PrettyData';
import "./GyroscopeScene.css";

/*
    GyroscopeScene(imu data):
        Uses 3js to display a live visual of the satellite. Unfortunately, with MPU6050 it's not possible to accurately display
        the yaw, so sorta useless. Abandoned for IMUVisualizer.
*/


function GyroscopeModel(props) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    const DEGREE_TO_RADIANS = Math.PI / 180;
    useFrame(function(state, delta){
        mesh.current.rotation.y = (props.imu["ROLL"]);
        mesh.current.rotation.x = -1 * (1.57079633 + (props.imu["PITCH"]));
    })

    return(
        <mesh
            {...props}
            ref={mesh}
            scale={1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
        >
            <boxGeometry args={[2, 5, 1]}/>
            <meshLambertMaterial color={'#fc0303'} />
			<axesHelper args={[3, 3, 3]}/>
        </mesh> 
    )
}

function GryoscopeScene(props) {
  	return (
		<div id="gyroscope-container">
            <PrettyData data={props.imu}/>
			<Canvas>
				<ambientLight intensity={0.1} />
				<directionalLight position={[0, 0, 5]} />
				<GyroscopeModel imu={props.imu} position={[0, 0, -2]}/>
			</Canvas>
		</div>
	)
}

export default GryoscopeScene;

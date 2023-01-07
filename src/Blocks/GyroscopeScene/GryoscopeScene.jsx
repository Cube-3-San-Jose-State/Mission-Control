import ReactDOM from 'react-dom'
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
    useFrame(function(state, delta){
        mesh.current.rotation.x = -(props.imu["ROLL"]);
        mesh.current.rotation.y = (props.imu["PITCH"]);
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
            <boxGeometry args={[5, 2, 1]}/>
            <meshLambertMaterial color={'#0047AB'} />
			<axesHelper args={[3, 3, 3]}/>
        </mesh>
    )
}

function GryoscopeScene(props) {
  	return (
		<div id="gyroscope-container">
			<Canvas>
				<ambientLight intensity={0.1} />
				<directionalLight position={[0, 0, 5]} />
				<GyroscopeModel imu={props.imu} position={[0, 0, -2]}/>
			</Canvas>
		</div>
	)
}

export default GryoscopeScene;

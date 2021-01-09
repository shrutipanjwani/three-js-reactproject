import React, {Suspense, useRef, useEffect} from 'react';
import './App.css';
import Header from "./components/header";
import { Section } from "./components/section";
import { Canvas, useFrame } from "react-three-fiber";
import { Html, useGLTFLoader } from "drei";
import state from './components/state';
import { useInView } from "react-intersection-observer";

const Model = ({modelPath}) => {
  const gltf = useGLTFLoader(modelPath, true);
  return <primitive object={gltf.scene} dispose={null} />;  
};

const Lights = () => {
  return (
    <>
      {/* Ambient Light illuminates lights for all objects */}
      <ambientLight intensity={0.3} />
      {/* Diretion light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Spotlight Large overhead light */}
      <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
    </>
  );
};

const HTMLContent = ({bgColor,domContent, children, modelPath, position}) => {

  const ref = useRef();
  useFrame(() => (ref.current.rotation.z += 0.01));
  const [refItem, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView]);

  return (
    <Section factor={1.5} offset={1}>
    <group position={[0, position, 0]}>
      <mesh ref={ref} position={[0, -35, 0]}>
        <Model modelPath={modelPath}/>
      </mesh>
      <Html portal={domContent} fullscreen>
        <div className="container" ref={refItem}>{children}</div>
      </Html>
    </group>
    </Section>
  );
};

export default function App() {

  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  return (
    <>
      <Header />
      
      <Canvas
        colorManagement
        camera={{position: [0, 0, 120], fov: 70}}>
        
        <Lights />

        <Suspense fallback={null}>

          <HTMLContent domContent={domContent}
          modelPath='/scene.gltf' 
          position={250}
          bgColor={'#f15946'}>
          <h1 className="title"></h1>
          </HTMLContent>
          
          <HTMLContent domContent={domContent}
          modelPath='/scene (2).gltf' 
          position={0}
          bgColor={'#571ec1'}>
          <h1 className="title">The ShoeBox</h1>
          </HTMLContent>
          
        </Suspense>
      </Canvas>
      <div className='scrollArea' ref={scrollArea}
        onScroll={onScroll}>
        <div style={{ position: "sticky", top: 0 }} ref={domContent} />
        <div style={{ height: `${state.sections * 100}vh` }} />
      </div>
    </>
  );
}


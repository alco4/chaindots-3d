import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import dunes from "./img/chaindots.png";
import "./styles.css";
import { fragmentShader } from "./shaders/fragment";
import { vertexShader } from "./shaders/vertex";
import { gsap } from "gsap";

// const IMG_SRC = "https://source.unsplash.com/random?r=1";
// const IMG_SRC = "https://picsum.photos/800";
// const IMG_SRC = hills;

// Image by @timdegroot
// https://unsplash.com/photos/yNGQ830uFB4
const IMG_SRC = dunes;

export default function ImagePlane(props) {
  const ref = useRef();
  const tex = useLoader(THREE.TextureLoader, IMG_SRC);
  const img = useLoader(THREE.ImageLoader, IMG_SRC);
  const raycaster = new THREE.Raycaster();

  const PLANE_SIZE = 4.0;
  const speed = {
    value: 0.006,
  };
  const tilt = {
    x: 0,
    y: 0,
  };
  let mouse = useRef(null);

  useEffect(() => {
    const update = (e) => {
      mouse.current = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", update);
    return () => {
      window.removeEventListener("pointermove", update);
    };
  }, []);

  useFrame(({ scene, camera }) => {
    if (ref.current) {
      ref.current.material.uniforms.uTime.value += speed.value;
      gsap.to(ref.current.rotation, {
        x: tilt.y,
        y: tilt.x,
        duration: 0.4,
      });

      // get mouse pos
      if (mouse.current !== null) {
        raycaster.setFromCamera(mouse.current, camera);
        const intersects = raycaster.intersectObjects([ref.current]);
        if (intersects.length) {
          const point = new THREE.Vector2(
            intersects[0].uv.x,
            intersects[0].uv.y
          );
          ref.current.material.uniforms.uMousePos.value = point;
          gsap.to(ref.current.material.uniforms.uMouseRadius, {
            value: 0.2,
            duration: 0.4,
            overwrite: true,
          });
        }
      }
    }
  });

  const handlePointerEnter = (e) => {
    gsap.to(ref.current.material.uniforms.uRadius, {
      value: 1.5,
      duration: 1.8,
      overwrite: true,
    });
    gsap.to(speed, {
      value: 0.02,
      duration: 0.5,
      overwrite: true,
    });
    gsap.to(ref.current.material.uniforms.uSpikes, {
      value: 2.5,
      duration: 0.8,
      overwrite: true,
    });
  };

  const handlePointerLeave = () => {
    gsap.to(ref.current.material.uniforms.uRadius, {
      value: 0.5,
      duration: 0.6,
      overwrite: true,
    });
    gsap.to(speed, {
      value: 0.006,
      duration: 1.8,
      overwrite: true,
    });
    gsap.to(ref.current.material.uniforms.uSpikes, {
      value: 1.5,
      duration: 2,
      overwrite: true,
    });
    gsap.to(tilt, {
      x: 0,
      y: 0,
      duration: 0.4,
      overwrite: true,
    });
    gsap.to(ref.current.material.uniforms.uMouseRadius, {
      value: 0.0,
      duration: 0.2,
      overwrite: true,
    });
  };

  const handlePointerMove = (e) => {
    tilt.x = -1.0 * (((e.clientX / window.innerWidth) * 2 - 1) * 0.5);
    tilt.y = -1.0 * (((e.clientY / window.innerHeight) * 2 - 1) * 0.5);
  };

  return (
    <mesh
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <planeBufferGeometry args={[10, PLANE_SIZE, 1, 1]} />
      {/* <circleGeometry args={[2.5, 128, 128]} /> */}
      <shaderMaterial
        uniforms={{
          uColor: { value: new THREE.Color("lightskyblue") },
          uPlaneSize: { value: new THREE.Vector2(PLANE_SIZE, 2) },
          uImageSize: { value: new THREE.Vector2(img.width, img.height) },
          uMousePos: { value: new THREE.Vector2(0.0, 0.0) },
          uMouseRadius: { value: 0.0 },
          uTime: { value: 0.0 },
          uRadius: { value: 0.5 },
          uTexture: { value: tex },
          uSpikes: { value: 1.5 }, // adjust the waviness
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        // wireframe={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

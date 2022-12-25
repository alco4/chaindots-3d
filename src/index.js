import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import ImagePlane from "./ImagePlane";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <Canvas>
    <OrbitControls />
    <Stars />
    <ambientLight intensity={0.5} />
    <spotLight position={[10, 15, 10]} angle={0.3} />
    <Physics>
      <ImagePlane />
    </Physics>
  </Canvas>
);

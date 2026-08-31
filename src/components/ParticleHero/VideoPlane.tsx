'use client';

import { useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { blackTexture } from './useParticleScene';

interface VideoPlaneProps {
  texture: THREE.VideoTexture | null;
  video: HTMLVideoElement | null;
  brightness?: number;
  brightnessRef?: React.RefObject<{ value: number }>;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uBrightness;
  uniform float uVideoAspect;
  uniform float uScreenAspect;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float screenWider = step(uVideoAspect, uScreenAspect);
    float scaleY = uVideoAspect / uScreenAspect;
    float scaleX = uScreenAspect / uVideoAspect;
    uv.y = mix(uv.y, (uv.y - 0.5) * scaleY + 0.5, screenWider);
    uv.x = mix(uv.x, (uv.x - 0.5) * scaleX + 0.5, 1.0 - screenWider);

    vec3 color = texture2D(uTexture, uv).rgb * uBrightness;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function VideoPlane({ texture, video, brightness = 0.18, brightnessRef }: VideoPlaneProps) {
  const viewport = useThree((state) => state.viewport);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: blackTexture },
          uBrightness: { value: brightnessRef ? brightnessRef.current.value : brightness },
          uVideoAspect: { value: 1.0 },
          uScreenAspect: { value: 1.0 },
        },
        vertexShader,
        fragmentShader,
        depthWrite: false,
      }),
    [brightness, brightnessRef]
  );

  useEffect(() => () => material.dispose(), [material]);

  // Set texture once when it becomes available
  useEffect(() => {
    material.uniforms.uTexture.value = texture ?? blackTexture;
  }, [texture, material]);

  // Viewport only changes on resize — no need to recompute this every frame.
  useEffect(() => {
    material.uniforms.uScreenAspect.value = viewport.width / viewport.height;
  }, [material, viewport.width, viewport.height]);

  // Video aspect is fixed once metadata has loaded.
  useEffect(() => {
    if (!video) return;
    const applyAspect = () => {
      if (video.videoWidth) {
        material.uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;
      }
    };
    applyAspect();
    video.addEventListener('loadedmetadata', applyAspect);
    return () => video.removeEventListener('loadedmetadata', applyAspect);
  }, [video, material]);

  // Brightness is GSAP-driven during the intro, so it stays on the frame loop.
  useFrame(() => {
    if (!brightnessRef) return;
    material.uniforms.uBrightness.value = brightnessRef.current.value;
  });

  return (
    <mesh
      position={[0, 0, -1]}
      scale={[viewport.width, viewport.height, 1]}
      renderOrder={-1}
    >
      <planeGeometry args={[1, 1]} />
      <primitive object={material} />
    </mesh>
  );
}

'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import basePath from '@/lib/basePath';
import { blackTexture } from './useParticleScene';

const MODEL_URL = `${basePath}/3D/maelogo2.glb`;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vScreenPos;
  void main() {
    // Model UVs, only used for the green rim on each piece.
    vUv = vec2(uv.x, 1.0 - uv.y - 0.1);
    vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vScreenPos = clipPos.xy / clipPos.w * 0.5 + 0.5;
    gl_Position = clipPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float uMobile;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uVideoAspect;
  uniform float uScreenAspect;
  uniform vec2 uLensCenter;
  uniform float uLensZoom;
  varying vec2 vUv;
  varying vec2 vScreenPos;
  void main() {
    // The logo reads as a lens over the background video rather than a
    // separate copy of it: sample the same footage in screen space, blown up
    // slightly around the logo's own centre.
    vec2 uv = (vScreenPos - uLensCenter) / uLensZoom + uLensCenter;

    // Identical cover-fit to VideoPlane so the lens lines up with what is
    // actually behind it.
    float screenWider = step(uVideoAspect, uScreenAspect);
    float scaleY = uVideoAspect / uScreenAspect;
    float scaleX = uScreenAspect / uVideoAspect;
    uv.y = mix(uv.y, (uv.y - 0.5) * scaleY + 0.5, screenWider);
    uv.x = mix(uv.x, (uv.x - 0.5) * scaleX + 0.5, 1.0 - screenWider);

    vec3 edgeColor = vec3(0.616, 0.941, 0.196);
    float margin = 0.02;
    float edgeMask = step(margin, vUv.x) * step(vUv.x, 1.0 - margin) *
                     step(margin, vUv.y) * step(vUv.y, 1.0 - margin);

    vec3 texColor = texture2D(map, uv).rgb;
    vec3 color = mix(edgeColor, texColor, edgeMask);

    // Grayscale with color reveal
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 grayColor = vec3(gray);

    vec2 mobileReveal = vec2(
      0.5 + sin(uTime * 0.4) * 0.3 + sin(uTime * 1.1) * 0.15,
      0.5 + cos(uTime * 0.3) * 0.25 + sin(uTime * 0.9) * 0.15
    );
    vec2 reveal = mix(uMouse, mobileReveal, uMobile);
    vec2 diff = vScreenPos - reveal;
    float distSq = dot(diff, diff);
    float radiusSq = 0.1225; // 0.35 * 0.35
    float blend = 1.0 - smoothstep(radiusSq * 0.0225, radiusSq, distSq);
    color = mix(grayColor, color, blend);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const MAX_TILT = Math.PI * 0.25;
const MAX_DROP = 1.5;

/** How much the logo magnifies the video behind it. 1.0 = no magnification. */
const LENS_ZOOM = 1.18;

// Scratch objects, reused every frame to keep the render loop allocation-free.
const scratchVec = new THREE.Vector3();

interface Logo3DProps {
  scale?: number;
  scrollProgressRef?: React.RefObject<number>;
  mouseRef?: React.RefObject<{ x: number; y: number }>;
  mode?: 'hero' | 'footer';
  isMobile?: boolean;
  sharedTexture?: THREE.VideoTexture | null;
  introOffsetRef?: React.RefObject<number>;
  onReady?: () => void;
}

export default function Logo3D({
  scale = 1,
  scrollProgressRef,
  mouseRef,
  mode = 'hero',
  isMobile = false,
  sharedTexture,
  introOffsetRef,
  onReady,
}: Logo3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const initializedRef = useRef(false);

  // Load GLB model — cached and shared between the hero and footer canvas
  const { scene } = useGLTF(MODEL_URL);

  // One material per instance, created before the model is cloned so meshes
  // never render with a throwaway placeholder first. Uniforms are driven
  // imperatively from useFrame, so the material itself never needs rebuilding.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: blackTexture },
          uMobile: { value: 0.0 },
          uTime: { value: 0.0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uVideoAspect: { value: 1.0 },
          uScreenAspect: { value: 1.0 },
          uLensCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uLensZoom: { value: LENS_ZOOM },
        },
        vertexShader,
        fragmentShader,
      }),
    []
  );

  useEffect(() => {
    material.uniforms.map.value = sharedTexture ?? blackTexture;
  }, [material, sharedTexture]);

  useEffect(() => () => material.dispose(), [material]);

  // Clone shares geometry with the cached GLTF scene, so the geometry must NOT
  // be disposed here — the other canvas renders the exact same buffers.
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) mesh.material = material;
    });
    return cloned;
  }, [scene, material]);

  // Local centre of the logo, used to keep the lens anchored to the model
  // rather than to the middle of the screen.
  const modelCenter = useMemo(
    () => new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3()),
    [model]
  );

  // Smooth rotation and position based on scroll
  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const uniforms = material.uniforms;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMobile.value = isMobile ? 1.0 : 0.0;

    // Match the background plane's cover-fit so the lens stays aligned.
    const video = sharedTexture?.image as HTMLVideoElement | undefined;
    if (video?.videoWidth) {
      uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;
    }
    uniforms.uScreenAspect.value = state.viewport.width / state.viewport.height;

    const mouse = mouseRef?.current ?? { x: 0, y: 0 };
    // Convert mouse from [-1,1] to [0,1] range for shader
    uniforms.uMouse.value.set(mouse.x * 0.5 + 0.5, 1.0 - (mouse.y * 0.5 + 0.5));

    const scrollProgress = scrollProgressRef?.current ?? 0;
    let targetRotationX: number;
    let targetY: number;

    if (mode === 'hero') {
      // Intro offset pushes logo below screen (only applies to hero)
      const introProgress = introOffsetRef?.current ?? 0;
      const combinedProgress = Math.min(scrollProgress + introProgress, 2.0);
      targetRotationX = combinedProgress * -MAX_TILT;
      targetY = -(combinedProgress * combinedProgress) * MAX_DROP;
    } else {
      targetRotationX = -MAX_TILT * (1 - scrollProgress);
      targetY = MAX_DROP * (1 - scrollProgress);
    }

    // Mouse-based tilt + position offset
    const mouseTilt = isMobile ? 0.25 : 0.15;
    const targetRotationY = mouse.x * mouseTilt;
    const targetMouseTiltX = mouse.y * -mouseTilt * 0.5;
    const mouseShift = isMobile ? 0 : 0.15;
    const targetMouseX = mouse.x * mouseShift;
    const targetMouseY = mouse.y * -mouseShift * 0.4;

    // On first frame in hero mode, snap to off-screen position and signal ready.
    // Force introOffsetRef back to 2.0 in case GSAP already started animating
    // while the model was still loading (race condition).
    if (!initializedRef.current && mode === 'hero' && introOffsetRef) {
      initializedRef.current = true;
      (introOffsetRef as React.MutableRefObject<number>).current = 2.0;
      const resetProgress = Math.min(scrollProgress + 2.0, 2.0);
      group.rotation.x = resetProgress * -MAX_TILT + targetMouseTiltX;
      group.rotation.y = targetRotationY;
      group.position.x = targetMouseX;
      group.position.y = -(resetProgress * resetProgress) * MAX_DROP;
      onReady?.();
    } else {
      // Subtle floating motion
      const t = state.clock.elapsedTime;
      const floatY = Math.sin(t * 0.6) * 0.04 + Math.sin(t * 1.1) * 0.02;
      const floatRotZ = Math.sin(t * 0.4) * 0.008;

      group.rotation.x += (targetRotationX + targetMouseTiltX - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
      group.rotation.z += (floatRotZ - group.rotation.z) * 0.05;
      group.position.x += (targetMouseX - group.position.x) * 0.05;
      group.position.y += (targetY + targetMouseY + floatY - group.position.y) * 0.1;
    }

    // Project the logo's centre to screen space so the lens travels with it.
    // The transforms above only reach matrixWorld on the next render, so flush
    // them here rather than magnifying around a one-frame-old position.
    group.updateWorldMatrix(true, false);
    scratchVec.copy(modelCenter).applyMatrix4(group.matrixWorld).project(state.camera);
    uniforms.uLensCenter.value.set(scratchVec.x * 0.5 + 0.5, scratchVec.y * 0.5 + 0.5);
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

// Preload model
useGLTF.preload(MODEL_URL);

'use client'

import { useEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Stand-in until the shared video texture is ready. Binding a null sampler
 * leaves an incomplete texture bound, which some drivers warn about on every
 * draw call; an explicit 1x1 black pixel keeps the same look without that.
 */
export const blackTexture = (() => {
  const texture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
  texture.needsUpdate = true
  return texture
})()

export type ScreenSize =
  | 'mobile'
  | 'tablet-sm'
  | 'tablet-md'
  | 'tablet'
  | 'desktop-sm'
  | 'desktop'
  | 'desktop-lg'
  | null

const BREAKPOINTS: { max: number; size: Exclude<ScreenSize, null> }[] = [
  { max: 768, size: 'mobile' },
  { max: 900, size: 'tablet-sm' },
  { max: 1000, size: 'tablet-md' },
  { max: 1200, size: 'tablet' },
  { max: 1500, size: 'desktop-sm' },
  { max: 1900, size: 'desktop' },
  { max: Infinity, size: 'desktop-lg' },
]

const SCALE_AND_ZOOM: Record<Exclude<ScreenSize, null>, { scale: number; zoom: number }> = {
  mobile: { scale: 0.07, zoom: 180 },
  'tablet-sm': { scale: 0.085, zoom: 200 },
  'tablet-md': { scale: 0.095, zoom: 210 },
  tablet: { scale: 0.11, zoom: 220 },
  'desktop-sm': { scale: 0.11, zoom: 250 },
  desktop: { scale: 0.12, zoom: 280 },
  'desktop-lg': { scale: 0.15, zoom: 280 },
}

/** Renderer settings shared by both canvases. */
export const isStrongHardware =
  typeof navigator !== 'undefined' && navigator.hardwareConcurrency > 4

export const canvasDpr: [number, number] = isStrongHardware ? [1, 2] : [1, 1.5]

export const glOptions = {
  antialias: true,
  alpha: true,
  stencil: false,
  powerPreference: 'high-performance' as const,
}

/** Tracks the active breakpoint. Returns null until measured on the client. */
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setScreenSize(BREAKPOINTS.find(({ max }) => width < max)!.size)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return screenSize
}

export const getScaleAndZoom = (screenSize: ScreenSize) =>
  SCALE_AND_ZOOM[screenSize ?? 'desktop-lg']

/**
 * Mouse position in [-1, 1] on desktop, an autonomous drift on mobile.
 * The drift loop only runs while the scene is active so an off-screen
 * canvas costs nothing.
 */
export const usePointerTilt = (screenSize: ScreenSize, active: boolean) => {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (screenSize === 'mobile') {
      if (!active) return
      let raf = 0
      const animate = (time: number) => {
        const t = time * 0.001
        mouseRef.current.x =
          Math.sin(t * 0.4) * 0.8 + Math.sin(t * 1.1) * 0.5 + Math.cos(t * 0.7) * 0.3
        mouseRef.current.y =
          Math.cos(t * 0.3) * 0.7 + Math.sin(t * 0.9) * 0.4 + Math.cos(t * 1.4) * 0.3
        raf = requestAnimationFrame(animate)
      }
      raf = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(raf)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [screenSize, active])

  return mouseRef
}

/**
 * Drives the render loop. With frameloop="demand" nothing is drawn unless a
 * frame is requested, so an inactive canvas idles at zero GPU cost.
 */
export const Invalidator = ({ active }: { active: boolean }) => {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    if (active) invalidate()
  }, [active, invalidate])

  useFrame(() => {
    if (active) invalidate()
  })

  return null
}

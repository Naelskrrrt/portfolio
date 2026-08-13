"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Triangle, Mesh } from "ogl";
import { useTheme } from "next-themes";

// Port of ReactBits "Side Rays" (WebGL, ogl) — dawn light streaming from a corner.
// https://reactbits.dev/backgrounds/side-rays

type Origin = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface SideRaysProps {
  speed?: number;
  rayColor1?: string;
  rayColor2?: string;
  intensity?: number;
  spread?: number;
  origin?: Origin;
  tilt?: number;
  saturation?: number;
  blend?: number;
  falloff?: number;
  opacity?: number;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1];
};

const originToFlip = (origin: Origin): [number, number] => {
  switch (origin) {
    case "top-left":
      return [1, 0];
    case "bottom-right":
      return [0, 1];
    case "bottom-left":
      return [1, 1];
    default:
      return [0, 0];
  }
};

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

export function SideRays({
  speed = 1.2,
  rayColor1 = "#e8853a",
  rayColor2 = "#96b4dc",
  intensity = 1.1,
  spread = 2,
  origin = "top-left",
  tilt = 0,
  saturation = 1.4,
  blend = 0.3,
  falloff = 1.6,
  opacity = 0.55,
  className = "",
}: SideRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer: Renderer | null = null;
    let animationId: number | null = null;

    let renderer_: Renderer;
    try {
      renderer_ = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });
    } catch {
      // No WebGL context (headless rendering, hardware acceleration disabled,
      // locked-down browser). The rays are decorative: skip them rather than
      // letting the exception take the whole page down.
      return;
    }
    renderer = renderer_;

    const gl = renderer_.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const [flipX, flipY] = originToFlip(origin);
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      iSpeed: { value: speed },
      iRayColor1: { value: hexToRgb(rayColor1) },
      iRayColor2: { value: hexToRgb(rayColor2) },
      iIntensity: { value: intensity },
      iSpread: { value: spread },
      iFlipX: { value: flipX },
      iFlipY: { value: flipY },
      iTilt: { value: tilt },
      iSaturation: { value: saturation },
      iBlend: { value: blend },
      iFalloff: { value: falloff },
      iOpacity: { value: opacity },
    };

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms,
    });
    const mesh = new Mesh(gl, { geometry, program });

    const updateSize = () => {
      if (!container || !renderer) return;
      renderer.dpr = Math.min(window.devicePixelRatio, 2);
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
    };

    const loop = (t: number) => {
      if (!renderer) return;
      uniforms.iTime.value = t * 0.001;
      try {
        renderer.render({ scene: mesh });
        if (!reducedMotion) {
          animationId = requestAnimationFrame(loop);
        }
      } catch {
        return;
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize();
    // Reduced motion: render a single static frame, no animation loop
    animationId = requestAnimationFrame(loop);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", updateSize);
      if (renderer) {
        try {
          const loseCtx = renderer.gl.getExtension("WEBGL_lose_context");
          if (loseCtx) loseCtx.loseContext();
          const canvas = renderer.gl.canvas;
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        } catch {
          // ignore
        }
      }
      renderer = null;
    };
  }, [
    speed,
    rayColor1,
    rayColor2,
    intensity,
    spread,
    origin,
    tilt,
    saturation,
    blend,
    falloff,
    opacity,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none overflow-hidden ${className}`.trim()}
    />
  );
}

/**
 * Dawn rays streaming from the top-left corner, fixed over the whole page.
 * Theme-aware wrapper: amber over navy in dark mode, softened over white in light.
 */
export function DawnSideRays() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <div className="fixed inset-0 pointer-events-none z-[49]" aria-hidden>
      <SideRays
        key={isDark ? "dark" : "light"}
        origin="top-left"
        rayColor1={isDark ? "#e8853a" : "#c96a1f"}
        rayColor2={isDark ? "#96b4dc" : "#e8b98a"}
        intensity={isDark ? 1.25 : 0.6}
        opacity={isDark ? 0.55 : 0.25}
        blend={0.3}
        speed={1.2}
        className="w-full h-full"
      />
    </div>
  );
}

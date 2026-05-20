"use client"

import { useEffect, useRef } from "react"

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_accent;

float gridLine(vec2 uv, float spacing, float thickness) {
  vec2 g = abs(fract(uv / spacing) - 0.5);
  float d = min(g.x, g.y);
  return 1.0 - smoothstep(thickness - 0.005, thickness + 0.005, d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv;
  p.x *= aspect;

  vec2 drift = vec2(u_time * 0.008, u_time * 0.005);
  vec2 gp = p + drift;

  float mainGrid = gridLine(gp, 0.12, 0.012);
  float subGrid = gridLine(gp, 0.024, 0.04) * 0.4;

  vec2 m = u_mouse;
  m.x *= aspect;
  float md = length(p - m);
  float mInfluence = exp(-md * 4.0) * 0.55;
  float gridStrength = (mainGrid + subGrid * 0.5) * (0.45 + mInfluence);

  vec2 dotGrid = fract(gp * 50.0) - 0.5;
  float dotMask = 1.0 - smoothstep(0.05, 0.14, length(dotGrid));
  float wave = sin(gp.x * 1.4 + u_time * 0.15) * cos(gp.y * 1.6 - u_time * 0.12);
  dotMask *= smoothstep(-0.3, 0.6, wave) * 0.6;

  vec3 lineColor = vec3(0.92);
  vec3 bgColor = vec3(0.055, 0.062, 0.072);
  vec3 col = bgColor;
  col = mix(col, lineColor, gridStrength * 0.5);
  col = mix(col, lineColor, dotMask * 0.28);
  col = mix(col, u_accent, mInfluence * 0.22);

  gl_FragColor = vec4(col, 1.0);
}
`

function hslToRgb(h: number, s: number, l: number) {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const hue = h / 60
  const x = chroma * (1 - Math.abs((hue % 2) - 1))
  let r = 0
  let g = 0
  let b = 0

  if (hue >= 0 && hue < 1) [r, g, b] = [chroma, x, 0]
  else if (hue < 2) [r, g, b] = [x, chroma, 0]
  else if (hue < 3) [r, g, b] = [0, chroma, x]
  else if (hue < 4) [r, g, b] = [0, x, chroma]
  else if (hue < 5) [r, g, b] = [x, 0, chroma]
  else [r, g, b] = [chroma, 0, x]

  const match = l - chroma / 2
  return [r + match, g + match, b + match] as const
}

function readAccent() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
  const match = raw.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/)
  if (!match) return [0.23, 0.44, 0.78] as const
  return hslToRgb(Number(match[1]), Number(match[2]) / 100, Number(match[3]) / 100)
}

export function FlowSandBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    })
    if (!gl) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mouse = { x: 0.5, y: 0.5 }
    let raf = 0
    let startedAt = performance.now()

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const program = gl.createProgram()
    if (!vertexShader || !fragmentShader || !program) return

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution")
    const timeLoc = gl.getUniformLocation(program, "u_time")
    const mouseLoc = gl.getUniformLocation(program, "u_mouse")
    const accentLoc = gl.getUniformLocation(program, "u_accent")

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = (time: number) => {
      const [r, g, b] = readAccent()
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height)
      gl.uniform1f(timeLoc, (time - startedAt) / 1000)
      gl.uniform2f(mouseLoc, mouse.x, mouse.y)
      gl.uniform3f(accentLoc, r, g, b)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (!prefersReduced) raf = requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (event.clientX - rect.left) / rect.width
      mouse.y = 1 - (event.clientY - rect.top) / rect.height
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    startedAt = performance.now()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 h-full w-full opacity-55 mix-blend-screen"
    />
  )
}

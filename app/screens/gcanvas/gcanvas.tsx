import React from "react"
import { random, times, last } from "lodash-es"
import { View, Text, StyleSheet, Dimensions, AppState } from "react-native"
import { GCanvasView } from "@flyskywhy/react-native-gcanvas"
import { TouchableOpacity } from "react-native-gesture-handler"
import SimplexNoise from "simplex-noise"
import * as Canova from "canova"

import { curveMonotoneX, line } from "d3-shape"
const { height, width } = Dimensions.get("window")

const simplex = new SimplexNoise()

const vizWidth = width
const heightWidth = 200

const buildShape = (x: number, shapeWidth: number) => {
  return (Math.sin(2 * Math.PI * (x / shapeWidth) + Math.PI / 2) * 0.5 + 0.5) * heightWidth
}

const pointsAmount = 100
const pointStep = vizWidth / pointsAmount

const generatePoints = (shapeWidth: number, getY: (p: { x: number; y: number }) => number) =>
  times(shapeWidth / pointStep)
    .map((x) => x * pointStep)
    .map((x) => {
      return { x, y: getY({ x, y: buildShape(x, shapeWidth) }) }
    })

const track = generatePoints(width, (p) => p.y)

const repetitions = [
  [
    generatePoints(width, (p) => p.y + simplex.noise2D(p.x * 0.004 + 100, p.x * 0.004) * 30),
    generatePoints(width, (p) => p.y + simplex.noise2D(p.x * 0.001, p.x * 0.004) * 30),
  ],
  [
    generatePoints(width * 1.5, (p) => p.y + simplex.noise2D(p.x * 0.004 + 100, p.x * 0.004) * 30),
    generatePoints(width * 1.5, (p) => p.y + simplex.noise2D(p.x * 0.001, p.x * 0.004) * 30),
  ],
  [
    generatePoints(width * 0.8, (p) => p.y + simplex.noise2D(p.x * 0.001 + 100, p.x * 0.004) * 30),
    generatePoints(width * 0.8, (p) => p.y + simplex.noise2D(p.x * 0.001, p.x * 0.004) * 30),
  ],
]

const pathLine = line<{ x: number; y: number }>()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(curveMonotoneX)

export const GCanvasScreen = () => {
  const isGReactTextureViewReady = React.useRef()
  const canvasRef = React.useRef<any>()
  const ctxRef = React.useRef<CanvasRenderingContext2D>()

  const initCanvas = (canvas) => {
    if (canvasRef.current) {
      return
    }

    canvasRef.current = canvas
    ctxRef.current = canvasRef.current.getContext("2d")
  }

  const animationState = React.useRef({ pointIndex: 0, repetitionIndex: 0 }).current

  const draw = () => {
    // On Android, sometimes this.isGReactTextureViewReady is false e.g.
    // navigate from a canvas page into a drawer item page with
    // react-navigation on Android, the canvas page will be maintain
    // mounted by react-navigation, then if you continually call
    // this drawSome() in some loop, it's wasting CPU and GPU,
    // if you don't care about such wasting, you can delete
    // this.isGReactTextureViewReady and related onIsReady.

    const ctx = ctxRef.current

    // if (ctx && AppState.currentState === "active") {
    if (ctx) {
      const [left, right] = repetitions[animationState.repetitionIndex]

      const leftPoint = left[animationState.pointIndex] ?? last(left)
      const rightPoint = right[animationState.pointIndex] ?? last(right)
      const trackPoint = track[animationState.pointIndex] ?? last(track)

      const translateX = Math.max(0, animationState.pointIndex - track.length) * pointStep

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      Canova.draw(
        ctx,
        Canova.group({ y: 40, x: -translateX }, [
          (ctx) => {
            ctx.beginPath()

            ctx.strokeStyle = "#C4C4C4"
            ctx.lineWidth = 20
            pathLine.context(ctx)
            pathLine(track)
            ctx.stroke()
          },

          (ctx) => {
            ctx.beginPath()

            ctx.strokeStyle = "#00F0FF"
            ctx.lineWidth = 4
            pathLine.context(ctx)
            pathLine(right.slice(0, animationState.pointIndex))
            ctx.stroke()
          },

          (ctx) => {
            ctx.beginPath()

            ctx.strokeStyle = "#FF97F0"
            ctx.lineWidth = 4
            pathLine.context(ctx)
            pathLine(left.slice(0, animationState.pointIndex))
            ctx.stroke()
          },
          Canova.circle(trackPoint.x, trackPoint.y, 6, {
            fill: "white",
          }),
          Canova.circle(rightPoint.x, rightPoint.y, 6, {
            stroke: "#00F0FF",
            strokeWidth: 4,
            fill: "black",
          }),
          Canova.circle(leftPoint.x, leftPoint.y, 6, {
            stroke: "#FF97F0",
            strokeWidth: 4,
            fill: "black",
          }),
        ]),
      )

      if (animationState.pointIndex >= left.length && animationState.pointIndex >= right.length) {
        animationState.pointIndex = 0
        animationState.repetitionIndex = (animationState.repetitionIndex + 1) % repetitions.length
      } else {
        animationState.pointIndex++
      }
    }
  }

  React.useEffect(() => {
    let cancel = false

    const loop = () => {
      draw()
      if (!cancel) requestAnimationFrame(loop)
    }
    loop()

    return () => (cancel = true)
  }, [])

  return (
    <View testID="WelcomeScreen" style={styles.wrapper}>
      <GCanvasView
        onCanvasCreate={initCanvas}
        onIsReady={(value) => (isGReactTextureViewReady.current = value)}
        style={styles.gcanvas}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  gcanvas: {
    height: 500,
    width,
  },

  wrapper: { top: 0 },
})

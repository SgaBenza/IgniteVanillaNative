import React from "react"
import { random, times } from "lodash-es"
import { View, Text, StyleSheet, Dimensions, AppState } from "react-native"
import { GCanvasView } from "@flyskywhy/react-native-gcanvas"
import { TouchableOpacity } from "react-native-gesture-handler"

import * as Canova from "canova"
import { scaleLinear } from "d3-scale"
import { curveMonotoneX, line } from "d3-shape"
const { height, width } = Dimensions.get("window")

const size = 500
const halfSize = size / 2
const balancePillSize = { width: 200, height: 75, x: 150, y: 350 }

const yScale = scaleLinear([0, 100, 250, 400, 500], [250, 210, 30, 210, 250])

function getYValue(y) {
  return yScale(y)
}

const timesLength = 100
const factor = size / timesLength
const { perfect, left, right, pill } = {
  perfect: times(timesLength).map((d) => {
    const value = d * factor
    return { x: value, y: getYValue(value) }
  }),
  left: times(timesLength).map((d) => {
    const value = d * factor
    return { x: value, y: getYValue(value) }
  }),
  right: times(timesLength).map((d) => {
    const noisyOffset = Math.round(Math.random() * 50)
    const sign = noisyOffset % 2 === 0 ? 1 : -1
    const value = d * factor
    return { x: value, y: getYValue(value) + noisyOffset * sign }
  }),
  pill: times(timesLength).map((_, i) => {
    return { degrees: i === 0 ? 0 : random(-90, 90) }
  }),
}

const pathLine = line<{ x: number; y: number }>()
  .x((d) => d.x)
  .y((d) => d.y)
const d = pathLine.curve(curveMonotoneX)

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

  const drawState = React.useRef({ startTime: Date.now() }).current

  const draw = () => {
    // On Android, sometimes this.isGReactTextureViewReady is false e.g.
    // navigate from a canvas page into a drawer item page with
    // react-navigation on Android, the canvas page will be maintain
    // mounted by react-navigation, then if you continually call
    // this drawSome() in some loop, it's wasting CPU and GPU,
    // if you don't care about such wasting, you can delete
    // this.isGReactTextureViewReady and related onIsReady.

    const ctx = ctxRef.current

    if (ctx && AppState.currentState === "active") {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      const time = Date.now() - drawState.startTime
      // console.log("draw", time)

      const i = time * 0.004

      const outerRadius = 60 + 20 * Math.sin(i * 0.5)
      const cx = width / 2
      const cy = canvasRef.current.height / 2

      Canova.draw(ctx, [
        Canova.rect(0, 0, width, height, { stroke: "red", strokeWidth: 4 }),
        Canova.circle(cx, cy, outerRadius, { stroke: "red", strokeWidth: 2 }),
        Canova.circle(cx + Math.cos(i * 4) * outerRadius, cy + Math.sin(i) * outerRadius, 10, {
          fill: "blue",
        }),
        Canova.circle(cx + Math.cos(i) * outerRadius, cy + Math.sin(i) * outerRadius, 10, {
          fill: "pink",
        }),
      ])

      // Canova.draw(ctx, (ctx) => {})
    }
  }

  React.useEffect(() => {
    const id = setInterval(draw, 1000 / 60)
    return () => clearInterval(id)
  }, [])

  return (
    <View testID="WelcomeScreen" style={styles.wrapper}>
      <TouchableOpacity onPress={draw}>
        <Text style={styles.welcome}>Draw</Text>
      </TouchableOpacity>

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
    // backgroundColor: '#FF000030', // TextureView doesn't support displaying a background drawable since Android API 24
  },
  welcome: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: "center",
  },
  wrapper: { top: 0 },
})

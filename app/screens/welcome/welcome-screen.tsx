import React, { FC } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
} from "react-native"
import { GCanvasView } from "@flyskywhy/react-native-gcanvas"
import { TouchableOpacity } from "react-native-gesture-handler"

const { height, width } = Dimensions.get("window")

export const WelcomeScreen = () => {
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

  const drawSome = () => {
    // On Android, sometimes this.isGReactTextureViewReady is false e.g.
    // navigate from a canvas page into a drawer item page with
    // react-navigation on Android, the canvas page will be maintain
    // mounted by react-navigation, then if you continually call
    // this drawSome() in some loop, it's wasting CPU and GPU,
    // if you don't care about such wasting, you can delete
    // this.isGReactTextureViewReady and related onIsReady.
    console.log("isGReactTextureViewReady: ", isGReactTextureViewReady)

    const ctx = ctxRef.current

    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      ctx.beginPath()

      // rect
      ctx.fillStyle = "red"
      ctx.fillRect(0, 0, width - 10, height)
      ctx.fillStyle = "blue"
      ctx.fillRect(0, 0, 30, 30)

      // //rect
      // ctx.fillStyle = "green"
      // ctx.fillRect(50, 50, 50, 50)

      // ctx.fill()

      // ctx.beginPath()

      // //circle
      // ctx.fillStyle = "blue"
      // ctx.moveTo(100, 150)
      // ctx.arc(125, 125, 25, 0, Math.PI * 2, true)

      // ctx.fill()
    }
  }

  return (
    <View testID="WelcomeScreen" style={styles.wrapper}>
      <TouchableOpacity onPress={drawSome}>
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
  wrapper: { top: 100 },
})

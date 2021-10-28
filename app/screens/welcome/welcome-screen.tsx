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
} from "react-native"
import { GCanvasView } from "@flyskywhy/react-native-gcanvas"

export const WelcomeScreen = () => {
  const isGReactTextureViewReady = React.useRef()
  const canvasRef = React.useRef<any>()
  const ctxRef = React.useRef()

  const initCanvas = (canvas) => {
    if (canvasRef.current) {
      return
    }

    canvasRef.current = canvas
    ctxRef.current = canvasRef.current.getContext("2d")
  }

  const drawSome = async () => {
    // On Android, sometimes this.isGReactTextureViewReady is false e.g.
    // navigate from a canvas page into a drawer item page with
    // react-navigation on Android, the canvas page will be maintain
    // mounted by react-navigation, then if you continually call
    // this drawSome() in some loop, it's wasting CPU and GPU,
    // if you don't care about such wasting, you can delete
    // this.isGReactTextureViewReady and related onIsReady.

    const ctx = ctxRef.current

    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      
      console.log("ctx: ", ctx)
      ctx.beginPath()

      //rect
      ctx.fillStyle = "red"
      ctx.fillRect(0, 0, 400, 650)

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
    <View testID="WelcomeScreen" style={{ top: 100 }}>
      <TouchableHighlight onPress={drawSome}>
        <Text style={styles.welcome}>A MAMMMt</Text>
      </TouchableHighlight>
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
    width: 1800,
    // backgroundColor: '#FF000030', // TextureView doesn't support displaying a background drawable since Android API 24
  },
  welcome: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: "center",
  },
})

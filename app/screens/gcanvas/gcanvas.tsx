import React, { FC } from "react"
import { SafeAreaView, View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "../../navigators/app-navigator"

const { height, width } = Dimensions.get("window")

export const GCanvasScreen: FC<StackScreenProps<NavigatorParamList, "gcanvas">> = observer(() => {
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
    }
  }

  return (
    <View testID="WelcomeScreen" style={styles.wrapper}>
      <TouchableOpacity onPress={drawSome}>
        <Text style={styles.welcome}>Draw</Text>
      </TouchableOpacity>
      {/* <GCanvasView
        onCanvasCreate={initCanvas}
        onIsReady={(value) => (isGReactTextureViewReady.current = value)}
        style={styles.gcanvas}
      /> */}
    </View>
  )
})

const styles = StyleSheet.create({
  gcanvas: {
    height: 500,
    width,
  },
  welcome: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: "center",
  },
  wrapper: { top: 100 },
})

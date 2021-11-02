import React from "react"
import { View, Button } from "react-native"

export const NavigatorButtons = ({ navigation }) => {
  return (
    <View>
      <Button title="Rect Native SVG" onPress={() => navigation.navigate("svg")} />
      <Button title="Rect Native GCanvas" onPress={() => navigation.navigate("gcanvas")} />
    </View>
  )
}

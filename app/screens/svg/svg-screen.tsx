import React, { FC } from "react"
import { ViewStyle, SafeAreaView, Text, StyleSheet, View, TextStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "../../navigators"
import { SvgAnimation } from "./svg-animation"

const FULL: ViewStyle = { flex: 1 }
const TEXT_LAYOUT: ViewStyle = {
  padding: 30,
  position: "absolute",
}
const TEXT_STYLE: TextStyle = { fontSize: 20, fontWeight: "800", color: "red" }

export const SvgScreen: FC<StackScreenProps<NavigatorParamList, "svg">> = observer(() => {
  return (
    <SafeAreaView style={FULL}>
      <View style={TEXT_LAYOUT}>
        <Text style={TEXT_STYLE}>PRESS ON SVG FOR ANIMATION!</Text>
      </View>
      <SvgAnimation />
    </SafeAreaView>
  )
})

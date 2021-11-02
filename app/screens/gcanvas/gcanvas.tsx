import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { SafeAreaView, View, Text } from "react-native"
import { NavigatorParamList } from "../../navigators/app-navigator"

export const GCanvasScreen: FC<StackScreenProps<NavigatorParamList, "gcanvas">> = observer(() => {
  return (
    <SafeAreaView>
      <Text>React Native GCanvas</Text>
    </SafeAreaView>
  )
})

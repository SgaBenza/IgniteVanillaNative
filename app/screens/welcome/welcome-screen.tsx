import React, { FC } from "react"
import { SafeAreaView } from "react-native"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { NavigatorButtons } from "../../components/navigator-buttons/navigator-buttons"

export const WelcomeScreen: FC<StackScreenProps<NavigatorParamList, "welcome">> = observer(
  ({ navigation }) => {
    return (
      <SafeAreaView>
        <NavigatorButtons navigation={navigation} />
      </SafeAreaView>
    )
  },
)

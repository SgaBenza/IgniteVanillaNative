import React, { useState } from "react"
import { View, SafeAreaView, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import Svg, { Circle, Path, G } from "react-native-svg"
import { NavigatorParamList } from "../../navigators"
import { line, curveMonotoneX } from "d3-shape"
import { color, MockAnimation, vizHeight, vizWidth } from "../animation.mock"
import { useIsFocused } from "@react-navigation/core"

const SVG_STYLE: ViewStyle = {
  width: vizWidth,
  height: vizHeight,
}

const WRAPPER_STYLE: ViewStyle = { height: "100%", justifyContent: "center" }

const pathLine = line<{ x: number; y: number }>()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(curveMonotoneX)

const useRender = () => {
  const [, set] = useState(0)
  return () => set((i) => i + 1)
}

function useConst<T>(initial: T): T {
  return React.useRef(initial).current
}

export const SvgScreen: React.FC<StackScreenProps<NavigatorParamList, "svg">> = observer(() => {
  const isFocused = useIsFocused()
  const render = useRender()
  const animationState = useConst(MockAnimation.initialState())

  const {
    leftPoint,
    rightPoint,
    trackPoint,
    leftVisiblePoints,
    rightVisiblePoints,
    track,
    translateX,
  } = MockAnimation.computeFrameData(animationState)

  // RENDER
  React.useEffect(() => {
    let cancel = false
    requestAnimationFrame(() => {
      if (!cancel && isFocused) render()
    })

    return () => (cancel = true)
  }, [isFocused, render])

  React.useEffect(() => {
    let cancel = false

    const loop = () => {
      Object.assign(animationState, MockAnimation.updateAnimationState(animationState))
      if (!cancel && isFocused) setTimeout(loop, 1000 / 100)
    }
    loop()

    return () => (cancel = true)
  }, [isFocused])

  return (
    <SafeAreaView>
      <View style={WRAPPER_STYLE}>
        <Svg viewBox={`0 0 ${vizWidth} ${vizHeight}`} style={SVG_STYLE}>
          <G translateX={-translateX} translateY={40}>
            <Path d={pathLine(track)} stroke={color.track} strokeWidth={20} />
            <Path d={pathLine(leftVisiblePoints)} stroke={color.left} strokeWidth={4} />
            <Path d={pathLine(rightVisiblePoints)} stroke={color.right} strokeWidth={4} />

            <Circle cx={trackPoint.x} cy={trackPoint.y} r={6} fill={"white"} />
            <Circle
              cx={leftPoint.x}
              cy={leftPoint.y}
              r={6}
              fill={"black"}
              stroke={color.left}
              strokeWidth={4}
            />
            <Circle
              cx={rightPoint.x}
              cy={rightPoint.y}
              r={6}
              fill={"black"}
              stroke={color.right}
              strokeWidth={4}
            />
          </G>
        </Svg>
      </View>
    </SafeAreaView>
  )
})

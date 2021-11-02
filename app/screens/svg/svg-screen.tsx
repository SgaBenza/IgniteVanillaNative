import React, { FC, useRef, useState } from "react"
import {
  View,
  ViewStyle,
  SafeAreaView,
  Text as Testo,
  TextStyle,
  TouchableHighlight,
  Animated,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { random, times } from "lodash-es"
import Svg, { Circle, Rect, Path, G } from "react-native-svg"
import { NavigatorParamList } from "../../navigators"
import { line, curveMonotoneX } from "d3-shape"
import { scaleLinear } from "d3-scale"

const FULL: ViewStyle = { flex: 1 }
const BUTTON: ViewStyle = {
  position: "absolute",
  left: 20,
  top: 40,
  backgroundColor: "lightblue",
  padding: 30,
  borderColor: "blue",
  borderWidth: 2,
}
const BUTTON_TEXT: TextStyle = { fontSize: 30, fontWeight: "800", color: "blueviolet" }

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

const pathLine = line()
  .x((d) => d.x)
  .y((d) => d.y)
const d = pathLine.curve(curveMonotoneX)

export const SvgScreen: FC<StackScreenProps<NavigatorParamList, "svg">> = observer(() => {
  const [leftValue, setLeftValue] = useState(left[0])
  const [rightValue, setRightValue] = useState(right[0])

  const [leftCurrentData, setLeftCurrentData] = useState<{ x: number; y: number }[]>([left[0]])
  const [rightCurrentData, setRightCurrentData] = useState<{ x: number; y: number }[]>([left[0]])

  const [pillDegrees, setPillDegrees] = useState(pill[0])
  const pillFill = pillDegrees.degrees === 0 ? "pink" : pillDegrees.degrees >= 0 ? "red" : "green"

  const start = useRef(0)
  const onAction = () => {
    const intervalID = setInterval(() => {
      start.current++
      if (start.current < left.length) {
        setLeftValue(left[start.current])
        setRightValue(right[start.current])

        const leftData = left.slice(0, start.current)
        setLeftCurrentData(leftData)
        const rightData = right.slice(0, start.current)
        setRightCurrentData(rightData)
        setPillDegrees(pill[start.current])
      } else {
        clearInterval(intervalID)
        start.current = 0
      }
    }, 1000 / 60)
  }
  return (
    <SafeAreaView style={FULL}>
      <View>
        <TouchableHighlight onPress={onAction}>
          <View style={BUTTON}>
            <Testo style={BUTTON_TEXT}>ACTION</Testo>
          </View>
        </TouchableHighlight>
        <Svg viewBox={`0 0 ${size} ${size}`}>
          <Rect x={0} y={0} width={size} height={size} fill="orange" />
          <Path d={d(perfect)} stroke="red" strokeWidth={30} opacity={0.3} />

          <Handlebar data={rightValue} fill="red" />
          <Path d={d(rightCurrentData)} stroke="red" strokeWidth={5} />

          <Handlebar data={leftValue} fill="green" />
          <Path d={d(leftCurrentData)} stroke="green" strokeWidth={5} />
          <G
            id="BalancePill"
            transform={`rotate(${pillDegrees.degrees},${
              balancePillSize.x + balancePillSize.width / 2
            },${balancePillSize.y + balancePillSize.height / 2})`}
          >
            <Rect
              width={balancePillSize.width}
              height={balancePillSize.height}
              x={balancePillSize.x}
              y={balancePillSize.y}
              fill={pillFill}
            />
            <Circle
              cx={balancePillSize.x + balancePillSize.width / 2}
              cy={balancePillSize.y + balancePillSize.height / 2}
              r={10}
              fill="black"
            />
          </G>
        </Svg>
      </View>
    </SafeAreaView>
  )
})

const CircleAnimated = Animated.createAnimatedComponent(Circle)
const Handlebar = ({ data, fill }: { data: { x: number; y: number }; fill: string }) => {
  const { x, y } = data
  return <CircleAnimated cx={x} cy={y} r={20} fill={fill} stroke="lemonchiffon" strokeWidth={5} />
}

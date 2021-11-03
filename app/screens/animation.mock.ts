import { last, times } from "lodash"
import { Dimensions } from "react-native"
import SimplexNoise from "simplex-noise"

const { width } = Dimensions.get("window")

const simplex = new SimplexNoise()

export const vizWidth = width
export const vizHeight = 300

const shapeHeight = 200

const buildShape = (x: number, shapeWidth: number) => {
  return (Math.sin(2 * Math.PI * (x / shapeWidth) + Math.PI / 2) * 0.5 + 0.5) * shapeHeight
}

const pointsAmount = 150
const pointStep = vizWidth / pointsAmount

const generatePoints = (shapeWidth: number, getY: (p: { x: number; y: number }) => number) =>
  times(shapeWidth / pointStep)
    .map((x) => x * pointStep)
    .map((x) => {
      return { x, y: getY({ x, y: buildShape(x, shapeWidth) }) }
    })

const track = generatePoints(width, (p) => p.y)

const repetitions = [
  [
    generatePoints(width, (p) => p.y + simplex.noise2D(p.x * 0.004 + 100, p.x * 0.004) * 30),
    generatePoints(width, (p) => p.y + simplex.noise2D(p.x * 0.001, p.x * 0.004) * 30),
  ],
  [
    generatePoints(width * 1.5, (p) => p.y + simplex.noise2D(p.x * 0.004 + 100, p.x * 0.004) * 30),
    generatePoints(width * 1.5, (p) => p.y + simplex.noise2D(p.x * 0.001, p.x * 0.004) * 30),
  ],
  [
    generatePoints(width * 0.8, (p) => p.y + simplex.noise2D(p.x * 0.001 + 100, p.x * 0.004) * 30),
    generatePoints(width * 0.8, (p) => p.y + simplex.noise2D(p.x * 0.001, p.x * 0.004) * 30),
  ],
  [
    generatePoints(width * 1.8, (p) => p.y + simplex.noise2D(p.x * 0.001 + 100, p.x * 0.004) * 30),
    generatePoints(width * 1.8, (p) => p.y + simplex.noise2D(p.x * 0.001, p.x * 0.004) * 30),
  ],
]

export const color = {
  left: "#00F0FF",
  right: "#FF97F0",
  track: "#C4C4C4",
}

interface AnimationState {
  repetitionIndex: number
  pointIndex: number
}

export const MockAnimation = {
  initialState: (): AnimationState => ({ pointIndex: 0, repetitionIndex: 0 }),

  computeFrameData: (state: AnimationState) => {
    const [left, right] = repetitions[state.repetitionIndex]

    const leftPoint = left[state.pointIndex] ?? last(left)
    const rightPoint = right[state.pointIndex] ?? last(right)
    const trackPoint = track[state.pointIndex] ?? last(track)

    const translateX = Math.max(0, state.pointIndex - track.length) * pointStep

    const rightVisiblePoints = right.slice(0, state.pointIndex)
    const leftVisiblePoints = left.slice(0, state.pointIndex)

    return {
      leftPoint,
      rightPoint,
      trackPoint,
      translateX,
      rightVisiblePoints,
      leftVisiblePoints,
      track,
    }
  },

  updateAnimationState: (state: AnimationState): AnimationState => {
    const newState = { ...state }

    const [left, right] = repetitions[state.repetitionIndex]

    if (newState.pointIndex >= left.length && newState.pointIndex >= right.length) {
      newState.pointIndex = 0
      newState.repetitionIndex = (newState.repetitionIndex + 1) % repetitions.length
    } else {
      newState.pointIndex++
    }

    return newState
  },
}

import React from "react"
import { ViewStyle } from "react-native"
import Video from "react-native-video"

const VIDEO_STYLE: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export const VideoBackground = () => {
  return (
    <Video
      source={require("./bg-video.mov")}
      style={VIDEO_STYLE as any}
      controls={false}
      playInBackground
      muted
      repeat
      disableFocus
      resizeMode="cover"
    />
  )
}

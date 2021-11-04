const path = require("path")

module.exports = {
  assets: ["./assets/fonts/"],
  dependencies: {
    "@flyskywhy/react-native-gcanvas": {
      platforms: {
        android: {
          packageImportPath: "import com.taobao.gcanvas.bridges.rn.GReactPackage;",
        },
      },
    },
  },
}

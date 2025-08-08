// Do NOT put JSX here. This is the Expo config file.
module.exports = {
  expo: {
    name: "Swipe Stack",
    slug: "swipe-stack",
    scheme: "swipestack",
    version: "1.0.0",
    orientation: "portrait",
    // Comment out icons/splash until you add files to ./assets
    // icon: "./assets/icon.png",
    // splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#0B0F17" },
    ios: { supportsTablet: false },
    android: {
      adaptiveIcon: {
        // foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0B0F17"
      }
    },
    plugins: [],
    extra: {}
  }
};

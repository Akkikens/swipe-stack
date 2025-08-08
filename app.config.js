module.exports = {
  expo: {
    name: "Swipe Stack",
    slug: "swipe-stack",
    scheme: "swipestack",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0B0F17"
    },
    ios: { supportsTablet: false },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon-foreground.png",
        backgroundColor: "#0B0F17"
      },
      notification: {
        icon: "./assets/notification-icon.png",
        color: "#7C3AED"
      }
    }
  }
};

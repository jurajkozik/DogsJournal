import LottieView from "lottie-react-native";
import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useState } from "react";
import Onboarding from "react-native-onboarding-swiper";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreens({ route, navigation }) {
  const [completed, setCompleted] = useState(false);

  return (
    <Onboarding
      nextLabel="Další"
      skipLabel="Přeskočit"
      onDone={() => navigation.navigate("Login")}
      onSkip={() => navigation.navigate("Login")}
      pages={[
        {
          backgroundColor: "white",
          image: (
            <View>
              <LottieView
                source={require("../../assets/animations/animation_running_dog.json")}
                autoPlay={true}
                loop={true}
                style={{ width: width * 0.8, height: width }}
              />
            </View>
          ),
          title: "Cviky a povely",
          subtitle: "Vycvičte své pejsky a naučte je nové cviky a povely!",
        },
        {
          backgroundColor: "white",
          image: (
            <View>
              <LottieView
                source={require("../../assets/animations/animation_dog_to_the_moon.json")}
                autoPlay={true}
                loop={true}
                style={{ width: width * 0.8, height: width }}
              />
            </View>
          ),
          title: "Vlastní cvkiy",
          subtitle: "Vytvořte se vlastní cviky dle svých a pejskových potřeb!",
        },
        {
          backgroundColor: "white",
          image: (
            <View>
              <LottieView
                source={require("../../assets/animations/animation_onboarding3.json")}
                autoPlay={true}
                loop={true}
                style={{ width: width * 0.8, height: width }}
              />
            </View>
          ),
          title: "Objevujte další funkcionality",
          subtitle:
            "Vyzkoušte si vytvářet vlastní události v kalendáři, ukládejte si dokumenty a podívejte se na zdravotní rady!",
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
});

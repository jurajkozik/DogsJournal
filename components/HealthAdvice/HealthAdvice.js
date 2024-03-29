import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useState } from "react";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreens({ route, navigation }) {
  const [completed, setCompleted] = useState(false);
  
  return (
    <Onboarding
      nextLabel="Další"
      skipLabel="Přeskočit"
      onDone={() => navigation.goBack()}
      onSkip={() => navigation.goBack()}
      pages={[
        {
          backgroundColor: "white",
          image: (
            <View>
              <LottieView
                source={require("../../assets/animations/animation_vet.json")}
                autoPlay={true}
                loop={true}
                style={{ width: width * 0.8, height: width }}
              />
            </View>
          ),
          title: "Přehrátí",
          subtitle: (
            <View>
              <Text style={{ fontSize: 16 }}>
                Umístit psa do stínu a chladu. Chladit vlažnou vodou v oblasti
                hlavy a končetin (pozor voda nesmí být ledová!). Zajistit
                dostatek tekutiny, ty nesmí být ledové, třeba je podávat
                postupně.
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Vyhledat lékaře při apatii, ztrátě vědomí, malátností.
              </Text>
            </View>
          ),
        },
        {
          backgroundColor: "white",
          title: "Průjem a zvracení",
          subtitle: (
            <View>
              <Text style={{ fontSize: 16 }}>
                Doporučená strava: kuřecí/krůtí prsa, nebo dietní konezrvy a
                granule (Hills i/d, Royal Canin Gastrointestinal). Podávat
                probiotika. Na zastavení průjmu lze podat smectu (menší pes
                1/4sáčku 2xdenně, větší 1/2 sáčku 2xdenně). Enterozoo gel,
                zoosorb - detoxikační přípravky, lze při zvracení, pozření
                trusu/jídla venku.
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Pokud je průjem s krví, pes zvrací několikrát za hodinu, pozřel
                jedovatou látku nebo se jedná o štěně, průjem se nelepší do 3-4
                dnů - ihned vyhledat veterináře!
              </Text>
            </View>
          ),
          image: (
            <View>
              <LottieView
                source={require("../../assets/animations/animation_vet.json")}
                autoPlay={true}
                loop={true}
                style={{ width: width * 0.8, height: width }}
              />
            </View>
          ),
        },
        {
          backgroundColor: "white",
          title: "Kulhání",
          subtitle: (
            <View>
              <Text style={{ fontSize: 16 }}>
                Klidový režim - chůze na vodítku, pomalé tempo, krátke trasy.
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Nelepšení v průbehu několika dní - ihned kontrola u veterináře.
              </Text>
            </View>
          ),
          image: (
            <View>
              <LottieView
                source={require("../../assets/animations/animation_vet.json")}
                autoPlay={true}
                loop={true}
                style={{ width: width * 0.8, height: width }}
              />
            </View>
          ),
        },
        {
          backgroundColor: "white",
          title: "Výtok z očí",
          subtitle:
            (<View>
              <Text style={{ fontSize: 16 }}>
              Kapky Ocuflash, případně ophtalmoseptonex, borová voda několikrát denně. Oční okolí lze otřít navlhčeným tampónem, případně Heřmánkovým odvarem.
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Nelepšení do tří dnů - vyhledat veterináře.</Text>
            </View>),
          image: (
            <View>
              <LottieView
                source={require("../../assets/animations/animation_vet.json")}
                autoPlay={true}
                loop={true}
                style={{ width: width * 0.8, height: width }}
              />
            </View>
          ),
        },
        {
          backgroundColor: "white",
          title: "Zánět v uších",
          subtitle:
            (<View>
              <Text style={{ fontSize: 16 }}>Psí čističe (otodine, otofin apod.) kapat 2x denně, lze vytřít gázou, nesahat hlouběji do ucha vatovou tyčinkou.</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Nelepšení do 3 dnů - vyhleda veterináře.</Text>
            </View>),
          image: (
            <View>
              <LottieView
                source={require("../../assets/animations/animation_vet.json")}
                autoPlay={true}
                loop={true}
                style={{ width: width * 0.8, height: width }}
              />
            </View>
          ),
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

import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import {db} from '../../firebaseConfig';
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function SkillDetail({ route, navigation }) {
  const { item } = route.params;
  const skillItem = item;

  const [actualPoints, setActualPoints] = useState(skillItem.Points);

  const handleAddPoint = () => {
    const addedPoint = Number(actualPoints + 1);
    if (addedPoint <= item.Max_points) {
      setActualPoints(Number(addedPoint));
    }
  };

  const handleDeductPoint = () => {
    const deductedPoint = Number(actualPoints - 1);
    if (deductedPoint >= 0) {
      setActualPoints(Number(deductedPoint));
    }
  };

  const handleSet = async () => {
    await updateDoc(doc(db, skillItem.Type, skillItem.id), {
      Points: actualPoints,
    });
    navigation.goBack();
  };

  useFocusEffect(
    useCallback((actualPointsRender) => {
      const onBackPress = () => {
        return true;
      };

      navigation.addListener("beforeRemove", (e) => {
        if (!onBackPress()) {
          console.log("preventDefault");
          e.preventDefault();
        }
      });

      return () => {
        navigation.removeListener("beforeRemove");
      };
    }, [])
  );

  return (
    <View styles={styles.container}>
      <SafeAreaView>
        <View>
          <LottieView
            source={require("../../assets/animations/animation_running_dog.json")}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
        <View>
          <Text style={styles.skillNameText}>{item.Name}</Text>
          <Text style={styles.describeText}>{item.Describe}</Text>
          <View style={styles.pointsAndButtons}>
            <AntDesign
              name="minuscircleo"
              size={32}
              color="black"
              onPress={handleDeductPoint}
            />
            <View style={styles.pointsTextRow}>
              <Text style={styles.pointsText}>{actualPoints}</Text>
              <Text style={styles.pointsText}> / {item.Max_points}</Text>
            </View>
            <AntDesign
              name="pluscircleo"
              size={32}
              color="black"
              onPress={handleAddPoint}
            />
          </View>
          <View style={styles.buttonStyle}>
            <Button title="Zpět" onPress={() => navigation.goBack()} />
            <Button title="Hotovo" onPress={handleSet} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skillNameText: {
    fontSize: 28,
    textAlign: "center",
    marginTop: "5%",
    fontWeight: "bold",
  },
  describeText: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "10%",
    fontSize: 18,
    color: 'gray',
  },
  buttonStyle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: 0,
    marginTop: "20%",
  },
  pointsAndButtons: {
    marginTop: "10%",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  pointsTextRow: {
    flexDirection: "row",
    fontSize: 28,
  },
  animation: {
    marginTop: "2%",
    width: width * 0.8,
    height: width,
    alignSelf: "center",
  },
  pointsText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
  },
});

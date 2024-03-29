import * as React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Button,
  TextInput,
  Dimensions,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import LottieView from "lottie-react-native";
import { Entypo } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function NewCustomSkill({ route, navigation }) {
  const { item } = route.params;

  const defaultSkillName = "Enter name of new skill";
  const defaultSkillDescription = "Enter description of your new skill";
  const newSkillText = "Přidat nové cvičení";
  const newSkillNameText = "Jméno cvičení";
  const newSkillDescText = "Popis nového cvičení";
  const newSkillMaxPointsText = "Maximální počet bodů";
  const newSkillButtonText = "Přidat nový cvik";
  const newSkillNamePlaceholder = "Jméno cvičení";
  const newSkillDescPlaceholder = "Popis cvičení";
  const maxPointsPlaceholder = "10";
  const maxPointsIfNotSet = 10;

  const [textName, setTextName] = useState("");
  const [textDescription, setTextDescription] = useState("");
  const [maxPoints, setMaxPoints] = useState("10");

  const handleNew = async () => {
    const collectionRef = collection(db, "Custom_exercise");
    const payload = {
      Name: textName,
      Describe: textDescription,
      DogID: item.id,
      Points: Number("0"),
      Max_points: Number(maxPoints),
      Type: "Custom_exercise",
    };
    await addDoc(collectionRef, payload);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo
              name="chevron-thin-left"
              size={30}
              color="black"
              style={styles.goingBack}
            ></Entypo>
          </TouchableOpacity>
          <Text style={styles.headerText}>{newSkillText}</Text>
        </View>
        <LottieView
          source={require("../../assets/animations/animation_don_on_treadmill.json")}
          autoPlay={true}
          loop={true}
          style={{
            width: width * 0.8,
            height: width,
            alignSelf: "center",
          }}
        />
        <View style={styles.nameWrapper}>
          <Text style={styles.nameTextStyle}>{newSkillNameText}</Text>
          <TextInput
            style={styles.inputName}
            placeholder={newSkillNamePlaceholder}
            onChangeText={(newTextName) => setTextName(newTextName)}
          />
        </View>
        <View style={styles.breedWrapper}>
          <Text style={styles.breedTextStyle}>{newSkillDescText}</Text>
          <TextInput
            multiline
            numberOfLines={3}
            maxLength={20}
            style={styles.inputBreed}
            placeholder={newSkillDescPlaceholder}
            onChangeText={(textDescription) =>
              setTextDescription(textDescription)
            }
          />
        </View>
        <View style={styles.maxPointsWrapper}>
          <Text style={styles.breedTextStyle}>{newSkillMaxPointsText}</Text>
          <TextInput
            style={styles.inputPoints}
            onChangeText={setMaxPoints}
            value={maxPoints}
            placeholder={maxPointsPlaceholder}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.bottomWrapper}>
          <Button title={newSkillButtonText} onPress={handleNew} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    marginLeft: "3%",
    fontSize: 32,
  },
  headerWrapper: {
    marginTop: "5%",
    flexDirection: "row",
  },
  nameTextStyle: {
    fontSize: 18,
  },
  inputName: {
    fontSize: 18,
    color: "grey",
  },
  nameWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    //width: "90%",
    width: width * 0.9,
    alignSelf: "center",
  },
  breedWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "10%",
    //width: "90%",
    width: width * 0.9,
    alignSelf: "center",
  },
  breedTextStyle: {
    fontSize: 18,
  },
  inputBreed: {
    fontSize: 18,
    color: "grey",
  },
  maxPointsWrapper: {
    marginTop: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
    //width: "90%",
    width: width * 0.9,
    alignSelf: "center",
  },
  bottomWrapper: {
    marginTop: "10%",
  },
  inputPoints: {
    fontSize: 18,
    color: "grey",
  },
});

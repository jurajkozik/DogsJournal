import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  collection,
  query,
  getDocs,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import AchievementController from "../Achievements/AchievementsController.js";

const { width, height } = Dimensions.get("window");

export default function Dog({ route, navigation }) {
  const { item } = route.params;
  const dogInfo = item;

  const overallRatingText = "Celkové hodnocení";
  const newCustomSkillBtn = "Přidat nový vlastní cvik";
  const skillOverviewText = "Všechny cviky";
  const documentsBtnText = "Dokumenty";

  const readinessNotReady = "Není připraven";
  const readinessLowLevel = "Splňuje základní výcvik";
  const readinessMediumLevel = "Je pokročilý";
  const readinessGoodLevel = "Je připraven";
  const editDogText = "Úpravit informace o " + dogInfo.Name;

  const [maxPoints, setMaxPoints] = useState("");
  const [recPoints, setReceivedPoints] = useState("");
  const [readiness, setReadiness] = useState("");
  const [readinessColor, setReadinessColor] = useState("red");
  const [isAchievementAvailable, setIsAchievementAvailable] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      AchievementController(dogInfo.id);
      let maximumPoints = 0;
      let receivedPoints = 0;

      const collectionRefBasic = collection(db, "Basic_exercise_inst");
      const queryBasic = query(
        collectionRefBasic,
        where("DogID", "==", dogInfo.id)
      );
      const snapshotBasic = await getDocs(queryBasic);

      const collectionRefAdvanced = collection(db, "Advanced_exercise_inst");
      const queryAdvanced = query(
        collectionRefAdvanced,
        where("DogID", "==", dogInfo.id)
      );
      const snapshotAdvanced = await getDocs(queryAdvanced);

      const collectionRefCustom = collection(db, "Custom_exercise");
      const queryCustom = query(
        collectionRefCustom,
        where("DogID", "==", dogInfo.id)
      );
      const snapshotCustom = await getDocs(queryCustom);

      snapshotBasic.forEach((doc) => {
        const data = doc.data();
        maximumPoints += Number(data.Max_points);
        receivedPoints += Number(data.Points);
      });

      snapshotAdvanced.forEach((doc) => {
        const data = doc.data();
        maximumPoints += Number(data.Max_points);
        receivedPoints += Number(data.Points);
      });

      snapshotCustom.forEach((doc) => {
        const data = doc.data();
        maximumPoints += Number(data.Max_points);
        receivedPoints += Number(data.Points);
      });
      setMaxPoints(maximumPoints);
      setReceivedPoints(receivedPoints);
      let result = Number(receivedPoints) / Number(maximumPoints);

      if (result < 0.5) {
        setReadiness(readinessNotReady);
        setReadinessColor("red");
      } else if (result < 0.76) {
        setReadiness(readinessLowLevel);
        setReadinessColor("orange");
      } else if (result < 90) {
        setReadiness(readinessMediumLevel);
        setReadinessColor("yellow");
      } else {
        setReadiness(readinessGoodLevel);
        setReadinessColor("green");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    //AchievementController(dogInfo.id);
    setIsAchievementAvailable(false);
    async function fetchAchievements() {
      const collectionRefAchievement = collection(db, "Achievements_inst");
      const queryAchievement = query(
        collectionRefAchievement,
        where("DogID", "==", dogInfo.id)
      );
      const snapshotAchievement = await getDocs(queryAchievement);
      snapshotAchievement.forEach((doc) => {
        if (doc.data().isAvailable && !doc.data().alreadyShown)
          setIsAchievementAvailable(true);
      });
    }
    fetchAchievements();
  }, [isFocused]);

  const deleteDogHandle = async () => {
    //delete calendar
    const calendarRef = collection(db, "Calendar");
    const queryCalendar = query(calendarRef, where("DogID", "==", dogInfo.id));
    const snapshotCalendar = await getDocs(queryCalendar);
    snapshotCalendar.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    //delete basic skills
    const basicRef = collection(db, "Basic_exercise_inst");
    const queryBasic = query(basicRef, where("DogID", "==", dogInfo.id));
    const snapshotBasic = await getDocs(queryBasic);
    snapshotBasic.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    //delete advanced skills
    const advancedRef = collection(db, "Advanced_exercise_inst");
    const queryAdvanced = query(advancedRef, where("DogID", "==", dogInfo.id));
    const snapshotAdvanced = await getDocs(queryAdvanced);
    snapshotAdvanced.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    //delete custom skills
    const customRef = collection(db, "Custom_exercise");
    const queryCustom = query(customRef, where("DogID", "==", dogInfo.id));
    const snapshotCustom = await getDocs(queryCustom);
    snapshotCustom.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    //delete documents
    try {
      const documentsRef = collection(db, "Documents");
      const queryDocuments = query(
        documentsRef,
        where("DogID", "==", dogInfo.id)
      );
      const snapshotDocuments = await getDocs(queryDocuments);
      snapshotDocuments.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      //delete details
      const detailsRef = collection(db, "Dogs_details");
      const queryDetails = query(detailsRef, where("DogID", "==", dogInfo.id));
      const snapshotDetails = await getDocs(queryDetails);
      snapshotDetails.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      //delete diary
      const diaryRef = collection(db, "Training_diary");
      const queryDiary = query(diaryRef, where("DogID", "==", dogInfo.id));
      const snapshotDiary = await getDocs(queryDiary);
      snapshotDiary.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    } catch (e) {}
    //delete achievements
    const achievementRef = collection(db, "Achievements_inst");
    const queryAchievement = query(
      achievementRef,
      where("DogID", "==", dogInfo.id)
    );
    const snapshotAchievement = await getDocs(queryAchievement);
    snapshotAchievement.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    //delete dog
    deleteDoc(doc(db, "Dogs", dogInfo.id));
    navigation.replace("Home");
  };

  const stringForDeletions = "Chystáte se vymazat pejska " + dogInfo.Name;
  const deleteDogAlert = () =>
    Alert.alert(stringForDeletions, "", [
      {
        text: "Zrušit",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteDogHandle() },
    ]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo
            name="chevron-thin-left"
            size={30}
            color="black"
            style={styles.goingBack}
          ></Entypo>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("DogDetail", { item: dogInfo })}
        >
          <View style={{ marginTop: "2%" }}>
            <View style={styles.flatListWrapper}>
              <View>
                <Image
                  source={{ uri: item.Photo }}
                  style={styles.petItemImage}
                />
              </View>
              <Text style={styles.petNameText}>{item.Name}</Text>
              <View>
                <MaterialCommunityIcons
                  name="dog"
                  color={readinessColor}
                  size={22}
                  style={styles.dogIcon}
                />
                <Text style={styles.pointsText}>
                  Získané body: {recPoints} z {maxPoints}
                </Text>

                <Text style={styles.readinessStyle}>
                  Připravenost pejska: {readiness}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditDog", { item: item })}
        >
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <Entypo
                name="pencil"
                size={28}
                color="black"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>{editDogText}</Text>
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SkillOverview", { item: item })}
        >
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <Entypo
                name="baidu"
                size={28}
                color="black"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>Přehled cviků</Text>
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("TrainingDiary", { item: item })}
        >
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <Entypo
                name="archive"
                size={28}
                color="black"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>Tréninkový diář</Text>
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("NewCustomSkill", { item: item })}
        >
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <Entypo
                name="circle-with-plus"
                size={28}
                color="black"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>Vytvoření nového cviku</Text>
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Journal", { item: item })}
        >
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <Entypo
                name="calendar"
                size={28}
                color="black"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>Kalendář</Text>
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Docs", { item: item })}
        >
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <Entypo
                name="documents"
                size={28}
                color="black"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>Dokumenty</Text>
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Achievements", { item: item })}
        >
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <Entypo
                name="trophy"
                size={28}
                color="black"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>Ocenění</Text>
              {isAchievementAvailable && (
                <AntDesign
                  name="exclamation"
                  color="red"
                  size={30}
                  style={styles.exclamationIcon}
                />
              )}
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("HealthAdvice")}>
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <Entypo
                name="briefcase"
                size={28}
                color="red"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>Zdravotní rady</Text>
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={deleteDogAlert}>
          <View style={styles.lineWrapper}>
            <View style={styles.leftWrapper}>
              <AntDesign
                name="minuscircle"
                size={28}
                color="red"
                style={styles.leftIcon}
              />
              <Text style={styles.textStyle}>Smazat pejska </Text>
            </View>
            <View style={styles.rightWrapper}>
              <AntDesign
                name="right"
                size={28}
                color="black"
                style={styles.rightIcon}
              />
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListItemDog: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  flatListItemBasic: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  flatListItemComplex: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  flatListWrapper: {
    //width: "95%",
    width: width * 0.95,
    height: height * 0.3,
    alignSelf: "center",
    color: "#808080",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 20,
    margin: 4,
    alignItems: "center",
    backgroundColor: "whitesmoke", //'#F5FFFA', '#F5FFFF'
    borderWidth: 0.2,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  petItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  petNameText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: "-10%",
  },
  dogIcon: {
    marginTop: "-10%",
    alignSelf: "center",
  },
  pointsText: {
    alignSelf: "center",
    fontSize: 18,
  },
  readinessInfo: {
    flexDirection: "column",
  },
  readinessStyle: {
    alignSelf: "center",
    fontSize: 18,
  },
  readinessText: {
    fontSize: 18,
  },
  readinessPointsText: {
    fontSize: 18,
    alignSelf: "auto",
  },
  ingredientsWrapper: {
    marginTop: 40,
  },
  ingredientsTitle: {
    paddingHorizontal: 20,
    fontSize: 16,
  },
  ingredientsListWrapper: {
    paddingVertical: 20,
  },
  ingredientItemWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginRight: 15,
    borderRadius: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  ingredientImage: {
    resizeMode: "contain",
  },
  textStyle: {
    alignSelf: "center",
    padding: "auto",
    margin: "auto",
    marginLeft: 5,
    fontSize: 24,
  },
  rightWrapper: {
    marginLeft: "auto",
  },
  rightIcon: {
    alignSelf: "auto",
    marginTop: 5,
    marginRight: 5,
    color: "grey",
  },
  leftIcon: {
    alignSelf: "auto",
    marginLeft: 5,
    marginTop: 5,
  },
  lineWrapper: {
    //width: "95%%",
    width: width * 0.95,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: "5",
    alignSelf: "center",
    alignItems: "stretch",
    height: 45,
    marginHorizontal: "15%",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 0.3,
  },
  leftWrapper: {
    flexDirection: "row",
    textAlign: "center",
  },
  goingBack: {
    marginTop: "8%",
    marginLeft: "3%",
  },
});

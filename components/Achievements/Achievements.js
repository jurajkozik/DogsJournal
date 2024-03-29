import * as React from "react";
import {
  FlatList,
  SafeAreaView,
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import LottieView from "lottie-react-native";
import { Entypo } from "@expo/vector-icons";
import {db} from '../../firebaseConfig';

export default function Achievements({ route, navigation }) {
  const { item } = route.params;
  const dog = item;

  const [achievementAvailable, setAchievementAvailable] = useState([]); //achievementy ktere jsou nove k animaci pro uzivatele
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievements, setAchievements] = useState([]); //Pro vsechny achievementy, vykresleni flat listu a ulozeni vsech achievementu do pole
  const [currAchievName, setCurrAchievName] = useState();
  const [currAchievIsAvailable, setCurrAchievIsAvailable] = useState();
  const [currAchievAlreadyShown, setCurrAchievAlreadyShown] = useState();
  const [currAchievDesc, setCurrAchievDesc] = useState();
  const [currAchievId, setCurrAchievId] = useState();
  const [achievementAvailableTmp, setAchievementsAvailableTmp] = useState([]);
  const achievementsText = "Přehled ocenění";
  const contragtzText = "Blahopřeji!";

  const screenWidth = Dimensions.get("window").width * 0.8;

  useEffect(() => {
    async function fetchData() {
      const collectionRef = collection(db, "Achievements_inst");
      const q = query(collectionRef, where("DogID", "==", dog.id));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setAchievements(data);
      //console.log(data);
      let counter = 1;
      snapshot.forEach((doc) => {
        if (
          doc.data().isAvailable &&
          !doc.data().alreadyShown &&
          counter == 1
        ) {
          setCurrAchievName(doc.data().Name);
          setCurrAchievIsAvailable(doc.data().isAvailable);
          setCurrAchievAlreadyShown(doc.data().alreadyShown);
          setCurrAchievDesc(doc.data().Description);
          setCurrAchievId(doc.id);
          setShowAchievement(true);
          counter++;
        } else if (doc.data().isAvailable && !doc.data().alreadyShown) {
          setAchievementAvailable((prevState) => [...prevState, doc.data()]);
        }
      });
    }
    fetchData();
  }, []);

  const renderAchievement = ({ item }) => {
    return (
      <View style={styles.flatListWrapper}>
        {item.isAvailable && (
          <Image
            source={require("../../assets/pictures/achievement_color_trophy.png")}
            style={styles.smallTrophyImage}
          />
        )}
        {!item.isAvailable && (
          <Image
            source={require("../../assets/pictures/achievement_bnw_trophy.png")}
            style={styles.smallTrophyImage}
          />
        )}
        <View style={{ flexDirection: "row", textAlign: "center" }}>
          <Text style={styles.achievementNameText}>{item.Name}</Text>
          {item.isAvailable && (
            <Entypo
              name="check"
              color="green"
              size={18}
              style={{ marginLeft: 10, paddingTop: 12 }}
            ></Entypo>
          )}
        </View>
        <View style={{ marginBottom: 3 }}>
          <Text style={{ marginLeft: 60 }}>{item.Description}</Text>
        </View>
      </View>
    );
  };

  const handleCloseAchievement = async () => {
    setShowAchievement(false);
    await updateDoc(doc(db, "Achievements_inst", currAchievId), {
      alreadyShown: true,
    });
    if (achievementAvailable.length != 0) {
      setShowAchievement(true);
      let counter = 1;
      achievementAvailable.forEach((item) => {
        if (counter == 1) {
          setCurrAchievName(item.Name);
          setCurrAchievIsAvailable(item.isAvailable);
          setCurrAchievAlreadyShown(item.alreadyShown);
          setCurrAchievDesc(item.Description);
          setCurrAchievId(item.id);
          counter++;
        } else {
          setAchievementsAvailableTmp((prevState) => [...prevState, item]);
        }
      });
    } else {
      setCurrAchievName();
      setCurrAchievIsAvailable();
      setCurrAchievAlreadyShown();
      setCurrAchievId();
    }
    setAchievementAvailable([]);
    setAchievementAvailable(achievementAvailableTmp);
    setAchievementsAvailableTmp([]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo
              name="chevron-thin-left"
              size={28}
              color="black"
              style={styles.goingBack}
            ></Entypo>
          </TouchableOpacity>
          <Text style={styles.headerText}>{achievementsText}</Text>
        </View>

        {showAchievement && (
          <View style={styles.achievementWrapper}>
            <Text style={styles.congratzTextStyle}>{contragtzText}</Text>
            <Text style={styles.achievNameText}>{currAchievName}</Text>
            <LottieView
              source={require("../../assets/animations/animation_confetti.json")}
              autoPlay={true}
              loop={true}
              style={{ width: screenWidth, height: screenWidth }}
            />
            <Text style={styles.achievDescText}>{currAchievDesc}</Text>
            <Button
              onPress={handleCloseAchievement}
              title="Zavřít"
            />
          </View>
        )}
        {!showAchievement && (
          <View>
            <FlatList
              data={achievements}
              renderItem={renderAchievement}
              keyExtractor={(item) => item.id}
            ></FlatList>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "white",
    marginHorizontal: "3%",
    width: "95%",
    borderWidth: 0.2,
    borderRadius: 10,
    borderColor: "grey",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  flatListItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: "row",
  },
  goingBack: {
    marginTop: "25%",
    marginLeft: "3%",
  },
  headerWrapper: {
    marginTop: "5%",
    marginBottom: "5%",
    marginHorizontal: "3%",
    flexDirection: "row",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 30,
    margin: 5,
  },
  achievNameText: {},
  achievDescText: {},
  smallTrophyImage: {
    width: 50,
    height: 40,
    resizeMode: "contain",
    marginTop: 10,
    marginLeft: 5,
  },
  currAchievDesc: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontSize: 18,
    color: "black",
  },
  achievementNameText: {
    fontSize: 24,
    marginTop: 10,
    marginLeft: 5,
    alignItems: "center",
    textAlign: "center",
  },
  lineWrapper: {
    width: "98%%",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: "5",
    alignSelf: "center",
    alignItems: "stretch",
    height: 40,
    marginBottom: 5,
  },
  achievementWrapper: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: "5%",
  },
  congratzTextStyle: {
    fontSize: 26,
    fontWeight: "bold",
  },
  achievNameText: {
    marginTop: "10%",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "10%",
  },
  achievDescText: {
    marginTop: "10%",
    fontSize: 18,
    marginBottom: "20%",
  },
});

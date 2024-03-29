import * as React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import {db} from "../../firebaseConfig";
import { useIsFocused } from "@react-navigation/native";
import { Entypo, AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SkillOverview({ route, navigation }) {
  const { item } = route.params;
  const dog = item;

  const basicSkillText = "Základní cviky";
  const advancedSkillText = "Pokročilé cviky";
  const customSkillText = "Vlastní cviky";

  const [basics, setBasics] = useState("");
  const [advanced, setAdvanced] = useState("");
  const [customs, setCustoms] = useState("");
  const [customsExists, setCustomExists] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      const collectionRef = collection(db, "Basic_exercise_inst");
      const q = query(collectionRef, where("DogID", "==", dog.id));
      const snapshot = await getDocs(q);
      setBasics(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    async function fetchData() {
      const collectionRef = collection(db, "Advanced_exercise_inst");
      const q = query(collectionRef, where("DogID", "==", dog.id));
      const snapshot = await getDocs(q);
      setAdvanced(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    async function fetchData() {
      const collectionRef = collection(db, "Custom_exercise");
      const q = query(collectionRef, where("DogID", "==", dog.id));
      const snapshot = await getDocs(q);
      setCustoms(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      customs.length > 0 ? setCustomExists(true) : setCustomExists(false);
    }
    fetchData();
  }, [isFocused]);

  const renderSkill = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigation.navigate("SkillDetail", { item: item })}
      >
        <View style={styles.lineWrapper}>
          <View style={styles.leftWrapper}>
            <Entypo
              name="baidu"
              size={30}
              color="black"
              style={styles.leftIcon}
            />
            <Text style={styles.textStyle}>{item.Name}</Text>
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
    );
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
          <Text style={styles.headerTextStyle}>Přehled cviků</Text>
        </View>
        <View style={styles.exerciseWrapper}>
          <Text style={styles.typeOfSkill}>{basicSkillText}</Text>
          <View>
            <FlatList
              style={styles.flatListItem}
              data={basics}
              renderItem={renderSkill}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
        <View style={styles.exerciseWrapper}>
          <Text style={styles.typeOfSkill}>{advancedSkillText}</Text>
          <View>
            <FlatList
              style={styles.flatListItem}
              data={advanced}
              renderItem={renderSkill}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
        {customsExists && (
          <View style={styles.exerciseWrapper}>
            <Text style={styles.typeOfSkill}>{customSkillText}</Text>
            <View>
              <FlatList
                style={styles.flatListItem}
                data={customs}
                renderItem={renderSkill}
                keyExtractor={(item) => item.id}
              />
            </View>
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
  flatListItem: {
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  flatListWrapper: {
    color: "#808080",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    margin: 4,
    alignItems: "center",
    backgroundColor: "mintcream",
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
    borderRadius: 10,
  },
  nameText: {
    fontSize: 24,
    marginLeft: -20,
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
    //width: "98%%",
    width: width * 0.98,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: "5",
    alignSelf: "center",
    alignItems: "stretch",
    height: 43,
    marginBottom: ".5%",
    borderBlockColor: "grey",
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 0.3,
  },
  leftWrapper: {
    flexDirection: "row",
    textAlign: "center",
  },
  typeOfSkill: {
    marginTop: "5%",
    fontSize: 26,
    marginLeft: "2%",
  },
  goingBack: {
    marginTop: "10%",
    marginLeft: "3%",
  },
  exerciseWrapper: {
    marginHorizontal: "3%",
  },
  headerWrapper: {
    flexDirection: "row",
    textAlign: "center",
    marginTop: "6%",
    marginHorizontal: "2%",
  },
  headerTextStyle: {
    fontSize: 28,
    color: "black",
    marginLeft: "3%",
  },
});

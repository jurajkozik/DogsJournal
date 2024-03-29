import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { useIsFocused } from "@react-navigation/native";
import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
} from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export default function TrainingDiary({ route, navigation }) {
  const { item } = route.params;
  const dogInfo = item;

  const headerText = "Tréninkový diář";
  const trainedText = "Trénované dovednosti: ";
  const dateOfTrainingText = "Datum tréninku: ";

  const [trainingDiaries, setTrainingDiaries] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    setTrainingDiaries([]);
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "Training_diary"),
            where("DogID", "==", dogInfo.id),
            orderBy('DateOfTraining', "desc")
          )
        );
        querySnapshot.forEach((doc) => {
          setTrainingDiaries((prevState) => [
            ...prevState,
            { ...doc.data(), id: doc.id },
          ]);
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [isFocused]);

  const renderDiary = ({ item }) => {
    let skillArray = item.Skills;
    let skillNames = [];
    skillArray.forEach((element) => {
      skillNames.push(element.Name);
    });
    let skillString = trainedText + skillNames.join(", ");
    let headerString = dateOfTrainingText + item.DateOfTraining;
    return (
      <View style={styles.infoDetailStyle}>
        <View style={styles.lineWrapper}>
          <Text style={styles.flatlistHeaderStyle}>{headerString}</Text>
          <Text style={styles.flatlistNotesStyle}>{item.Notes}</Text>
          <Text style={styles.skillsTextStyles}>{skillString}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.headerWrapper}>
          {/* Hlavicka, back button... */}
          <View style={styles.headerLeftStyle}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo
              name="chevron-thin-left"
              size={30}
              color="black"
              style={styles.goingBack}
            ></Entypo>
          </TouchableOpacity>
          <Text style={styles.headerTextStyle}>{headerText}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddTrainingDiary", { item: dogInfo })
            }
          >
            <AntDesign
              name="plus"
              size={36}
              color="black"
              style={styles.goingBack}
            ></AntDesign>
          </TouchableOpacity>
        </View>
        <View style={styles.contentStyle}>
          <FlatList
            data={trainingDiaries}
            style={styles.flatListItem}
            renderItem={renderDiary}
            keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    marginTop: "6%",
    marginHorizontal: "2%",
  },
  headerTextStyle: {
    fontSize: 28,
    color: "black",
    marginLeft: "3%",
  },
  contentStyle: {
    marginTop: "3%",
    alignSelf: "center",
    //width: "96%",
    width: width * 0.96,
  },
  lineWrapper: {
    marginLeft: "3%",
    marginRight: "3%",
    marginBottom: "2%",
    marginTop: "2%",
    justifyContent: "space-between",
    width: width * 0.95,
  },
  infoDetailStyle: {
    flexDirection: "column",
    marginHorizontal: "2%",
    marginTop: "4%",
    backgroundColor: "white",
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
    //width: "95%",
    width: width * 0.93,
  },
  flatlistHeaderStyle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  flatlistNotesStyle: {
    fontSize: 16,
    color: "black",
    marginTop: "1%",
  },
  skillsTextStyles: {
    fontSize: 16,
    color: "black",
    marginTop: "1%",
  },
  headerLeftStyle: {
    flexDirection: "row",
  },
});

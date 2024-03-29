import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { collection, query, getDocs, where } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { db } from "../../firebaseConfig";
import moment from "moment";

const { width, height } = Dimensions.get("window");

export default function DogDetail({ route, navigation }) {
  const { item } = route.params;
  const dogInfo = item;

  const propertiesText = "Podrobnosti";
  const nameText = "Jméno";
  const chipText = "Čip";
  const passText = "Evropský pas";
  const vacPassText = "Očkovací průkaz";
  const vacText = "Očkování";
  const vaccineR = "Vzteklina (R)";
  const dogIllnessesText = "Psí nemoci (DHPPi+L)";
  const tetanusText = "Tetanus (T)";
  const dogCaughtsText = "Psincový kašel (KC, Bb/Pi2)";
  const boreliosisText = "Borelióza (B)";
  const examsText = "Zkoušky";
  const doneText = "Hotovo";

  const [chipTextInfo, setChipTextInfo] = useState("Nezadáno");
  const [passTextInfo, setPassTextInfo] = useState("Nezadáno");
  const [vacPassTextInfo, setVacPassTextInfo] = useState("Nezadáno");
  const [vaccineRInfo, setVaccineRInfo] = useState("Nezadáno");
  const [dogIllnessesTextInfo, setDogIllnessesTextInfo] = useState("Nezadáno");
  const [tetanusTextInfo, setTetanusTextInfo] = useState("Nezadáno");
  const [dogCaughtsTextInfo, setDogCaughtsTextInfo] = useState("Nezadáno");
  const [boreliosisTextInfo, setBoreliosisTextInfo] = useState("Nezadáno");
  const [listItems, setListItems] = useState([]);
  const isFocused = useIsFocused();
  const [examListExists, setExamListExists] = useState(false);

  require("moment/locale/cs.js");

  useEffect(() => {
    const fetchDogDetails = async () => {
      try {
        const q = query(
          collection(db, "Dogs_Details"),
          where("DogID", "==", dogInfo.id)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          doc.data().Chip ? setChipTextInfo(doc.data().Chip) : null;
          doc.data().Pass ? setPassTextInfo(doc.data().Pass) : null;
          doc.data().VacPass ? setVacPassTextInfo(doc.data().VacPass) : null;
          doc.data().DateVacR
            ? setVaccineRInfo(doc.data().DateVacR.toString())
            : null;
          doc.data().DateDogIllnesses
            ? setDogIllnessesTextInfo(doc.data().DateDogIllnesses)
            : null;
          doc.data().DateTetanus
            ? setTetanusTextInfo(doc.data().DateTetanus)
            : null;
          doc.data().DateDogCaught
            ? setDogCaughtsTextInfo(doc.data().DateDogCaught)
            : null;
          doc.data().DateBoreliosis
            ? setBoreliosisTextInfo(doc.data().DateBoreliosis)
            : null;
          doc.data().Exams ? setListItems(doc.data().Exams) : null;
          listItems.length ? setExamListExists(true) : null;
        });
      } catch (error) {
        console.log("Error getting documents: ", error);
      }
    };
    fetchDogDetails();
  }, [isFocused]);

  const renderListItem = ({ item }) => {
    return (
      <View>
        <View style={styles.lineWrapper}>
          <Text style={styles.nameTextStyle}>{item}</Text>
          <Text style={styles.nameTextStyle}>{doneText}</Text>
        </View>
        <View
          style={{
            height: 0.25,
            width: "95%",
            alignSelf: "center",
            backgroundColor: "grey",
            padding: "0.05%",
          }}
        ></View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.headerWrapper}>
            {/* Hlavicka, back button... */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo
                name="chevron-thin-left"
                size={30}
                color="black"
                style={styles.goingBack}
              ></Entypo>
            </TouchableOpacity>
            <Text style={styles.headerTextStyle}>{propertiesText}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DogDetailEdit", { item: dogInfo })
              }
            >
              <Entypo
                name="edit"
                size={30}
                color="black"
                style={styles.editButton}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoDetailStyle}>
            <View style={styles.lineWrapper}>
              <Text style={styles.nameTextStyle}>{nameText}</Text>
              <Text style={styles.nameStyle}>{dogInfo.Name}</Text>
            </View>

            <View
              style={{
                height: 0.25,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>

            <View style={styles.lineWrapper}>
              <Text style={styles.nameTextStyle}>Datum narození</Text>
              <Text style={styles.nameStyle}>{dogInfo.DOB}</Text>
            </View>

            <View
              style={{
                height: 0.25,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>

            <View style={styles.lineWrapper}>
              <Text style={styles.nameTextStyle}>Plemeno</Text>
              <Text style={styles.nameStyle}>{dogInfo.Breed}</Text>
            </View>

            <View
              style={{
                height: 0.25,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>

            <View style={styles.lineWrapper}>
              <Text style={styles.nameTextStyle}>{chipText}</Text>
              <Text style={styles.nameStyle}>{chipTextInfo}</Text>
            </View>

            <View
              style={{
                height: 0.25,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>

            <View style={styles.lineWrapper}>
              <Text style={styles.nameTextStyle}>{passText}</Text>
              <Text style={styles.nameStyle}>{passTextInfo}</Text>
            </View>

            <View
              style={{
                height: 0.25,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>

            <View style={styles.lineWrapper}>
              <Text style={styles.nameTextStyle}>{vacPassText}</Text>
              <Text style={styles.nameStyle}>{vacPassTextInfo}</Text>
            </View>
          </View>
          <Text style={styles.vacTextStyle}>{vacText}</Text>
          <View style={styles.infoDetailStyle}>
            {/* Ockovani nadpis */}
            <View style={styles.lineWrapper}>
              {/* Vzteklina (R) + intervaly (1-3) */}
              <Text style={styles.nameTextStyle}>{vaccineR}</Text>
              <Text style={styles.nameStyle}>{vaccineRInfo}</Text>
            </View>
            <View
              style={{
                height: 0.25,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>
            <View style={styles.lineWrapper}>
              {/* Psí nemoci (DHPPi+L) kazdy rok */}
              <Text style={styles.nameTextStyle}>{dogIllnessesText}</Text>
              <Text style={styles.nameStyle}>{dogIllnessesTextInfo}</Text>
            </View>
            <View
              style={{
                height: 0.23,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>
            <View style={styles.lineWrapper}>
              {/* Tetanus (T) dvoulety interval */}
              <Text style={styles.nameTextStyle}>{tetanusText}</Text>
              <Text style={styles.nameStyle}>{tetanusTextInfo}</Text>
            </View>
            <View
              style={{
                height: 0.25,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>
            <View style={styles.lineWrapper}>
              {/* Psincovi kasel (KC nebo Bb/Pi2) jednou rocne*/}
              <Text style={styles.nameTextStyle}>{dogCaughtsText}</Text>
              <Text style={styles.nameStyle}>{dogCaughtsTextInfo}</Text>
            </View>
            <View
              style={{
                height: 0.25,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
                padding: "0.05%",
              }}
            ></View>
            <View style={styles.lineWrapper}>
              {/* Borelioza (B) jednou rocne */}
              <Text style={styles.nameTextStyle}>{boreliosisText}</Text>
              <Text style={styles.nameStyle}>{boreliosisTextInfo}</Text>
            </View>
          </View>
          <View>
            {examListExists && (
              <View>
                <Text style={styles.vacTextStyle}>{examsText}</Text>
                <FlatList
                  style={styles.flatListItem}
                  data={listItems}
                  scrollEnabled={false}
                  renderItem={renderListItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
            )}
          </View>
        </ScrollView>
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
  },
  infoDetailStyle: {
    flexDirection: "column",
    marginHorizontal: "2%",
    marginTop: "4%",
    backgroundColor: "white",
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
    //width: "95%",
    width: width * 0.95,
  },
  lineWrapper: {
    flexDirection: "row",
    marginLeft: "3%",
    marginRight: "3%",
    marginBottom: "2%",
    marginTop: "2%",
    justifyContent: "space-between",
  },
  nameTextStyle: {
    fontSize: 20,
    color: "black",
  },
  nameStyle: {
    fontSize: 20,
    color: "black",
  },
  vacTextStyle: {
    fontSize: 26,
    color: "black",
    marginTop: "4%",
    marginLeft: "3%",
    marginBottom: "-2%",
  },
  flatListItem: {
    marginTop: "3%",
    //width: "95%",
    width: width * 0.95,
    alignSelf: "center",
    backgroundColor: "white",
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
});

import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Switch,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  where,
  addDoc,
} from "firebase/firestore";
import moment from "moment";

const { width, height } = Dimensions.get("window");

export default function AddTrainingDiary({ route, navigation }) {
  const { item } = route.params;
  const dogInfo = item;

  const headerText = "Nový tréningový diář";
  const notesFromTraining = "Poznámky z tréningu";
  const dateOfTrainingText = "Datum tréninku";

  const [notesFromTrainingText, setNotesFromTrainingText] = useState();
  const [skills, setSkills] = useState([]);
  const [skillUsedInTraining, setSkillUsedInTraining] = useState([]);
  const [dateOfTraining, setDateOfTraining] = useState(new Date());

  //const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState("date");
  //const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const addOrRemoveItemFromList = (item) => {
    let isIncludedTmp = item.isIncluded;
    let negationIsIncluded = !isIncludedTmp;
    item.isIncluded = negationIsIncluded;
    setSkills(skills.map((skill) => (skill.id === item.id ? item : skill)));
    if (!isIncludedTmp) {
      setSkillUsedInTraining((prevDocuments) => [...prevDocuments, item]);
      console.log(skillUsedInTraining.length);
    } else {
      setSkillUsedInTraining(
        skillUsedInTraining.filter((item) => item.id !== item.id)
      );
    }
  };

  useEffect(() => {
    setSkills([]);
    async function fetchData() {
      const collectionRefBasic = collection(db, "Basic_exercise_inst");
      const q = query(collectionRefBasic, where("DogID", "==", dogInfo.id));
      const snapshotBasic = await getDocs(q);
      const data = snapshotBasic.docs.map((doc) => ({
        id: doc.id,
        isIncluded: false,
        ...doc.data(),
      }));
      setSkills(data);

      const collectionRefAdvanced = collection(db, "Advanced_exercise_inst");
      const q2 = query(collectionRefAdvanced, where("DogID", "==", dogInfo.id));
      const snapshotAdvanced = await getDocs(q2);
      const data2 = snapshotAdvanced.docs.map((doc) => ({
        id: doc.id,
        isIncluded: false,
        ...doc.data(),
      }));
      setSkills((prevDocuments) => [...prevDocuments, ...data2]);

      const collectionRefCustom = collection(db, "Custom_exercise");
      const q3 = query(collectionRefCustom, where("DogID", "==", dogInfo.id));
      const snapshotCustom = await getDocs(q3);
      const data3 = snapshotCustom.docs.map((doc) => ({
        id: doc.id,
        isIncluded: false,
        ...doc.data(),
      }));
      setSkills((prevDocuments) => [...prevDocuments, ...data3]);
    }
    fetchData();
  }, []);

  const onChangeDateTraining = (event, selectedDate) => {
    setDateOfTraining(selectedDate);
  };

  const saveDiary = async () => {
    let arrayToSave = [];
    skillUsedInTraining.forEach((element) => {
      arrayToSave.push({
        Name: element.Name,
      });
    });
    const collectionRef = collection(db, "Training_diary");
    const docRef = await addDoc(collectionRef, {
      DogID: dogInfo.id,
      Notes: notesFromTrainingText,
      Skills: arrayToSave,
      DateOfTraining: moment(dateOfTraining).format("DD.MM.YYYY"),
    });
    navigation.goBack();
  };

  const renderSkill = ({ item }) => {
    return (
      <View>
        <View style={styles.lineWrapper}>
          <Text style={styles.skillText}>{item.Name}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "lightgreen" }}
            thumbColor={item.isIncluded ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => addOrRemoveItemFromList(item)}
            value={item.isIncluded}
          />
        </View>
        <View
          style={{
            height: 0.1,
            //width: "95%",
            width: width * 0.95,
            alignSelf: "center",
            backgroundColor: "grey",
            padding: "0.05%",
            marginTop: "2%",
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
            <Text style={styles.headerTextStyle}>{headerText}</Text>
          </View>
          <View style={styles.contentWrapper}>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{notesFromTraining}</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Zadejte poznámky z tréningu"
                multiline={true}
                value={notesFromTrainingText}
                onChangeText={(text) => setNotesFromTrainingText(text)}
              />
            </View>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{dateOfTrainingText}</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateOfTraining}
                mode={mode}
                is24Hour={true}
                onChange={onChangeDateTraining}
              />
            </View>
            <FlatList
              style={styles.flatListItem}
              data={skills}
              renderItem={renderSkill}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
            />
            <View style={styles.bottomButtonsStyle}>
              <Button title="Uložit" onPress={() => saveDiary()} />
            </View>
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
    textAlign: "center",
    marginTop: "6%",
    marginHorizontal: "2%",
  },
  headerTextStyle: {
    fontSize: 28,
    color: "black",
    marginLeft: "3%",
  },
  lineWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "7%",
    textAlign: "center",
  },
  textStyle: {
    fontSize: 18,
  },
  inputStyle: {
    //width: "50%",
    width: width * 0.5,
  },
  flatListItem: {},
  skillText: {
    fontSize: 18,
  },
  bottomButtonsStyle: {
    marginTop: "3%",
  },
});

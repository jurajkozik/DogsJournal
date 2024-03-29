import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button,
  FlatList,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import moment from "moment";

const { width, height } = Dimensions.get("window");

export default function DogDetailEdit({ route, navigation }) {
  const { item } = route.params;
  const dogInfo = item;

  const propertiesText = "Podrobnosti k vyplnění";
  const chipText = "Čip";
  const passText = "Pas";
  const vacPassText = "Očkovací pas";
  const vaccineR = "Vzteklina (R)";
  const dogIllnessesText = "Psí nemoci (DHPPi+L)";
  const tetanusText = "Tetanus (T)";
  const dogCaughtsText = "Psincový kašel (KC, Bb/Pi2)";
  const borelisisText = "Borelióza (B)";
  const examsText = "Zkoušky a jiné";
  const saveText = "Uložit znměny";

  const [dateVacR, setDateVacR] = useState(new Date());
  const [dateDogIllnesses, setDateDogIllnesses] = useState(new Date());
  const [dateTetanus, setDateTetanus] = useState(new Date());
  const [dateDogCaught, setDateDogCaught] = useState(new Date());
  const [dateBoreliosis, setDateBoreliosis] = useState(new Date());
  const [mode, setMode] = useState("date");

  const [isChipSet, setIsChipSet] = useState(false);
  const [isPassSet, setIsPassSet] = useState(false);
  const [isVacPassSet, setIsVacPassSet] = useState(false);
  const [isVacRSet, setIsVacRSet] = useState(false);
  const [isDogIllnessesSet, setIsDogIllnessesSet] = useState(false);
  const [isTetanusSet, setIsTetanusSet] = useState(false);
  const [isDogCaughtSet, setIsDogCaughtSet] = useState(false);
  const [isBoreliosisSet, setIsBoreliosisSet] = useState(false);
  const [prevDocExists, setPrevDocExists] = useState(false);

  const [chipInput, setChipInput] = useState();
  const [passInput, setPassInput] = useState();
  const [vacPassInput, setVacPassInput] = useState();

  const [collectionId, setCollectionId] = useState();
  const [examsTextInput, setExamsTextInput] = useState("");
  const examsPlaceHolderText = "Jméno zkoušky";
  const saveExamsText = "Přidat";
  const [examsArray, setExamsArray] = useState([]);
  const saveExams = () => {
    if (examsTextInput) {
      setExamsArray([...examsArray, examsTextInput]);
      setExamsTextInput("");
    }
  };

  useEffect(() => {
    const fetchDogDetails = async () => {
      try {
        const q = query(
          collection(db, "Dogs_Details"),
          where("DogID", "==", dogInfo.id)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          doc.data().Chip && setChipInput(doc.data().Chip);
          doc.data().Pass && setPassInput(doc.data().Pass);
          doc.data().VacPass && setVacPassInput(doc.data().VacPass);
          doc.data().DateVacR &&
            setDateVacR(moment(doc.data().DateVacR, "DD.MM.YYYY").toDate());
          doc.data().DateDogIllnesses &&
            setDateDogIllnesses(
              moment(doc.data().DateDogIllnesses, "DD.MM.YYYY").toDate()
            );
          doc.data().DateTetanus &&
            setDateTetanus(
              moment(doc.data().DateTetanus, "DD.MM.YYYY").toDate()
            );
          doc.data().DateDogCaught &&
            setDateDogCaught(
              moment(doc.data().DateDogCaught, "DD.MM.YYYY").toDate()
            );
          doc.data().DateBoreliosis &&
            setDateBoreliosis(
              moment(doc.data().DateBoreliosis, "DD.MM.YYYY").toDate()
            );
          setPrevDocExists(true);
          setCollectionId(doc.id);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDogDetails();
  }, []);

  const onChangeDateVacR = (event, selectedDate) => {
    setDateVacR(selectedDate);
    setIsVacRSet(true);
  };

  const onChangeDateDogIllnesses = (event, selectedDate) => {
    setDateDogIllnesses(selectedDate);
    setIsDogIllnessesSet(true);
  };

  const onChangeDateTetanus = (event, selectedDate) => {
    setDateTetanus(selectedDate);
    setIsTetanusSet(true);
  };

  const onChangeDateDogCaught = (event, selectedDate) => {
    setDateDogCaught(selectedDate);
    setIsDogCaughtSet(true);
  };

  const onChangeDateBoreliosis = (event, selectedDate) => {
    setDateBoreliosis(selectedDate);
    setIsBoreliosisSet(true);
  };

  const saveDogDetail = async () => {
    const collectionRef = collection(db, "Dogs_Details");
    let objectToSave = {};
    isChipSet ? (objectToSave["Chip"] = chipInput) : null;
    isPassSet ? (objectToSave["Pass"] = passInput) : null;
    isVacPassSet
      ? (objectToSave["VacPass"] = moment(vacPassInput).format("DD.MM.YYYY"))
      : null;
    isVacRSet
      ? (objectToSave["DateVacR"] = moment(dateVacR).format("DD.MM.YYYY"))
      : null;
    isBoreliosisSet
      ? (objectToSave["DateBoreliosis"] =
          moment(dateBoreliosis).format("DD.MM.YYYY"))
      : null;
    isDogIllnessesSet
      ? (objectToSave["DateDogIllnesses"] =
          moment(dateDogIllnesses).format("DD.MM.YYYY"))
      : null;
    isTetanusSet
      ? (objectToSave["DateTetanus"] = moment(dateTetanus).format("DD.MM.YYYY"))
      : null;
    isDogCaughtSet
      ? (objectToSave["DateDogCaught"] =
          moment(dateDogCaught).format("DD.MM.YYYY"))
      : null;
    examsArray ? (objectToSave["Exams"] = examsArray) : null;
    objectToSave["DogID"] = dogInfo.id;
    if (prevDocExists) {
      //updateDoc
      await updateDoc(doc(db, "Dogs_Details", collectionId), objectToSave);
    } else {
      //addDoc
      await addDoc(collection(db, "Dogs_Details"), objectToSave);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
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
        </View>
        <ScrollView>
          <View style={styles.contentWrapper}>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{chipText}</Text>
              <TextInput
                style={styles.numericInput}
                onChangeText={(text) => (
                  setChipInput(text), setIsChipSet(true)
                )}
                value={chipInput}
                placeholder="Číslo čipu"
              />
            </View>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{passText}</Text>
              <TextInput
                style={styles.numericInput}
                onChangeText={(text) => (
                  setPassInput(text), setIsPassSet(true)
                )}
                value={passInput}
                placeholder="Číslo pasu"
              />
            </View>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{vacPassText}</Text>
              <TextInput
                style={styles.numericInput}
                onChangeText={(text) => (
                  setVacPassInput(text), setIsVacPassSet(true)
                )}
                value={vacPassInput}
                placeholder="Číslo očkovacího průkazu"
              />
            </View>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{vaccineR}</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateVacR}
                mode={mode}
                is24Hour={true}
                onChange={onChangeDateVacR}
              />
            </View>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{dogIllnessesText}</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateDogIllnesses}
                mode={mode}
                is24Hour={true}
                onChange={onChangeDateDogIllnesses}
              />
            </View>
            <View style={styles.lineWrapper}>
              <Text>{tetanusText}</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateTetanus}
                mode={mode}
                is24Hour={true}
                onChange={onChangeDateTetanus}
              />
            </View>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{dogCaughtsText}</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateDogCaught}
                mode={mode}
                is24Hour={true}
                onChange={onChangeDateDogCaught}
              />
            </View>
            <View style={styles.lineWrapper}>
              <Text style={styles.textStyle}>{borelisisText}</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={dateBoreliosis}
                mode={mode}
                is24Hour={true}
                onChange={onChangeDateBoreliosis}
              />
            </View>
            <View style={styles.lineWrapper}>
              <View style={styles.examsWrapper}>
                <Text style={styles.textStyle}>{examsText}</Text>
                <TextInput
                  style={styles.numericInput}
                  value={examsTextInput}
                  onChangeText={(text) => {
                    setExamsTextInput(text);
                  }}
                  placeholder={examsPlaceHolderText}
                />
              </View>
              <View style={styles.saveExamsButton}>
                <Button
                  title={saveExamsText}
                  onPress={() => {
                    saveExams();
                  }}
                />
              </View>
            </View>
            {examsArray && (
              <View>
                <FlatList
                  scrollEnabled={false}
                  style={styles.flatListStyle}
                  data={examsArray}
                  renderItem={({ item }) => <Text style={styles.examsTextStyle}>{item}</Text>}
                />
              </View>
            )}
          </View>
          <View style={styles.saveButton}>
            <Button title={saveText} onPress={saveDogDetail} />
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
  contentWrapper: {
    marginTop: "2%",
  },
  lineWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "10%",
  },
  numericInput: {
    marginRight: "3%",
    fontSize: 18,
    color: "grey",
  },
  saveButton: {
    marginTop: "5%",
    marginBottom: "15%",
  },
  textStyle: {
    fontSize: 18,
  },
  examsWrapper: {
    flexDirection: "column",
  },
  saveExamsButton: {
  },
  flatListStyle: {
    marginTop: "3%",
    //width: '90%',
    width: width * 0.9,
    alignSelf: 'center',
  },
  examsTextStyle: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
  },
});

import * as React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Button,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {db} from '../../firebaseConfig';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/src/locale/cs";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function AddDog({ route, navigation }) {
  const { item } = route.params;

  const [textName, setTextName] = useState("");
  const [textBreed, setTextBreed] = useState("");
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [photoImage, setImage] = useState(null);
  const [photoSelected, setPhotoSelected] = useState(false);

  const nameText = "Jméno";
  const nameTextPlaceholder = "Zadejte jméno";
  const dateOfBirthText = "Datum narození";
  const petBreedText = "Plemeno";
  const petBreedTextPlaceholder = "Zadejte plemeno";
  const addDogTextBtn = "Přidat";
  const newDogText = "Nový pejsek";
  const photoOfDogText = "Fotka";
  const pickPhotoText = "Vybrat fotku";
  //const DTP_show = false;

  const handleNew = async () => {
    require("moment/locale/cs.js");
    const normalFormatDate = moment(date).format("L");
    console.log(normalFormatDate);
    const collectionRefDog = collection(db, "Dogs");
    const payloadDog = {
      Name: textName,
      Breed: textBreed,
      DOB: normalFormatDate,
      UserId: item.uid,
      Photo: photoImage,
      Received_points: 0,
    };
    let dogID;
    await addDoc(collectionRefDog, payloadDog).then((collectionRefDog) => {
      dogID = collectionRefDog.id;
    });

    const collectionRefBasic_inst = collection(db, "Basic_exercise_inst");
    const snapshotBasic = await getDocs(collection(db, "Basic_exercise"));
    snapshotBasic.forEach((doc) => {
      const constNewBasicPayload = {
        Name: doc.data().Name,
        Describe: doc.data().Describe,
        DogID: dogID,
        Max_points: doc.data().Max_points,
        Points: 0,
        Type: "Basic_exercise_inst",
      };
      addDoc(collectionRefBasic_inst, constNewBasicPayload);
    });

    const collectionRefAdvanced_inst = collection(db, "Advanced_exercise_inst");
    const snapshotAdvanced = await getDocs(collection(db, "Advanced_exercise"));
    snapshotAdvanced.forEach((doc) => {
      const constNewBasicPayload = {
        Name: doc.data().Name,
        Describe: doc.data().Describe,
        DogID: dogID,
        Max_points: doc.data().Max_points,
        Points: 0,
        Type: "Advanced_exercise_inst",
      };
      addDoc(collectionRefAdvanced_inst, constNewBasicPayload);
    });

    const collectionRefJournal = collection(db, "Calendar");
    const payloadJournal = {
      DateOfEvent: normalFormatDate,
      DogID: dogID,
      Name: "Narozeniny",
      SelectedColor: "red",
      SelectedEvent: true,
    };
    let dateForCalendar = normalFormatDate;
    console.log('dateForCalendar: ' + dateForCalendar);
    await addDoc(collectionRefJournal, payloadJournal);
    for (let i = 1; i <= 15; ++i) {
      let dateForBday = moment(normalFormatDate, "DD.MM.YYYY").add(i, "y");
      let dateForBdayFormated = moment(dateForBday).format("DD.MM.YYYY");
      console.log('calendar: ' + dateForBdayFormated);
      const payloadJournalYears = {
        DateOfEvent: dateForBdayFormated,
        DogID: dogID,
        Name: "Narozeniny",
        SelectedColor: "red",
        SelectedEvent: true,
      };
      await addDoc(collectionRefJournal, payloadJournalYears);
    }

    const collectionRefAchievements = collection(db, "Achievements_inst");
    const snapshotAchievements = await getDocs(collection(db, "Achievements"));
    snapshotAchievements.forEach((doc) => {
      const achievementsPayload = {
        DogID: dogID,
        Name: doc.data().Name,
        Description: doc.data().Description,
        IsAvailable: false,
        alreadyShown: false,
        NoAchievement: doc.data().NoAchievement,
      };
      addDoc(collectionRefAchievements, achievementsPayload);
    });
    navigation.goBack();
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    };
    setPhotoSelected(true);
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
          <Text style={styles.headerText}>{newDogText}</Text>
        </View>
        {!photoSelected && (
          <Image
            source={require("../../assets/pictures/dog_puppy_face.jpg")}
            style={{
              width: width * 0.8,
              height: width * 0.7,
              alignSelf: "center",
            }}
          />
        )}
        {photoSelected && (
          <Image
            source={{ uri: photoImage }}
            style={{
              width: width * 0.8,
              height: width * 0.7,
              alignSelf: "center",
            }}
          />
        )}
        <View>
          <View style={styles.nameWrapper}>
            <Text style={styles.nameTextStyle}>{nameText}</Text>
            <TextInput
              style={styles.inputName}
              placeholder={nameTextPlaceholder}
              onChangeText={(newText) => setTextName(newText)}
              defaultValue={textName}
            />
          </View>
          <View style={styles.dobWrapper}>
            <Text style={styles.dobTextStyle}>{dateOfBirthText}</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChangeDate}
            />
          </View>
          <View style={styles.breedWrapper}>
            <Text style={styles.breedTextStyle}>{petBreedText}</Text>
            <TextInput
              style={styles.inputBreed}
              placeholder={petBreedTextPlaceholder}
              onChangeText={(newTextBreed) => setTextBreed(newTextBreed)}
              defaultValue={textBreed}
            />
          </View>
          <View style={styles.photoWrapper}>
            <Text style={styles.photoTextStyle}>{photoOfDogText}</Text>
            <Button title={pickPhotoText} onPress={pickImage} />
          </View>
          <View style={styles.bottomWrapper}>
            <Button title={addDogTextBtn} onPress={handleNew} />
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
  headerWrapper: {
    flexDirection: "row",
    marginTop: "5%",
  },
  headerText: {
    marginLeft: "2%",
    fontSize: 32,
  },
  nameTextStyle: {
    fontSize: 18,
  },
  inputName: {
    marginRight: "3%",
    fontSize: 18,
    color: "grey",
  },
  nameWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "10%",
  },
  dobWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "10%",
  },
  dobTextStyle: {
    fontSize: 18,
  },
  breedWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "10%",
  },
  breedTextStyle: {
    fontSize: 18,
  },
  inputBreed: {
    marginRight: "3%",
    fontSize: 18,
    color: "grey",
  },
  photoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "10%",
    textAlign: "center",
  },
  photoTextStyle: {
    fontSize: 18,
    textAlign: "center",
  },
  bottomWrapper: {
    marginTop: "10%",
  },
  goingBack: {
    marginLeft: "3%",
    marginTop: "6.5%",
  },
});

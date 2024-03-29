import { Calendar } from "react-native-calendars"; // 1.5.3
import {
  View,
  SafeAreaView,
  Button,
  Text,
  StyleSheet,
  Modal,
  Platform,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
//import DateTimePicker from "@react-native-community/datetimepicker";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import moment from "moment";
import { AntDesign, Entypo } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useIsFocused } from "@react-navigation/native";
import { db } from "../../firebaseConfig";

const { width, height } = Dimensions.get("window");

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

export default function Journal({ route, navigation }) {
  const { item } = route.params;
  const dog = item;

  let newDaysObject = {};
  const nameOfEventText = "Nazev události";
  const descOfEventText = "Popis události";
  const placeOfEventText = "Misto události";
  const btnCreateEventText = "Vytvořit událost";
  const btnCancelEventText = "Zrušit";
  const nameOfScreenText = "Kalendář pejska " + item.Name;
  const colorToPickText = "Barva události";
  const isFocused = useIsFocused();

  const [showModal, setShowModal] = useState(false);
  const toDay = getDate();
  console.log(toDay);
  const [text_nazev, onChangeText_nazev] = useState();
  const [text_misto, onChangeText_misto] = useState();
  const [text_popis, onChangeText_popis] = useState();

  const d = new Date();
  let diffOffset = d.getTimezoneOffset();
  const [timeOfEvent, setTimeOfEvent] = useState(new Date(Date.now()));
  const [dateOfEvent, setDateOfEvent] = useState(getDate());
  const [savedEvents, setSavedEvents] = useState([]);
  const [markedEventsSaved, setMarkedEventsSaved] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [valueColor, setValueColor] = useState("blue");
  const colorData = [
    { label: "Červená", value: "red" },
    { label: "Zelená", value: "green" },
    { label: "Modrá", value: "blue" },
    { label: "Oranžová", value: "orange" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const yearAway = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        );
        const yearAwayString = moment(yearAway).format("DD.MM.YYYY");
        const snapshot = await getDocs(
          query(
            collection(db, "Calendar"),
            where("DogID", "==", dog.id),
            orderBy("DateOfEvent", "desc")
          )
        );
        let markedDateArray = [];
        let markedDateColorArray = [];
        let tmpArray = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const dateDateOfEvent = moment(data.DateOfEvent, "DD.MM.YYYY");
          const dateYearAway = moment(yearAwayString, "DD.MM.YYYY");
          if (dateDateOfEvent <= dateYearAway) {
            tmpArray.push({data, id: doc.id})
            const localFormatDate = moment(data.DateOfEvent, "DD.MM.YYYY");
            const formatedDate = moment(localFormatDate).format("YYYY-MM-DD");
            markedDateArray.push(formatedDate);
            markedDateColorArray.push(data.SelectedColor);
          }
        });
        setSavedEvents(tmpArray);

        let counterColor = 0;
        markedDateArray.forEach((day) => {
          newDaysObject[day] = {
            selected: true,
            marked: true,
            selectedColor: markedDateColorArray[counterColor],
          };
          ++counterColor;
        });
        setMarkedEventsSaved(newDaysObject);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [isFocused]);

  const handleNew = async () => {
    selectedEvent = true;
    selectedColor = valueColor;

    setShowModal(!showModal);
    require("moment/locale/cs.js");
    const normalFormatDate = moment(dateOfEvent).format("L");
    const normalFormatTime = moment(timeOfEvent).format("HH:mm");
    onChangeText_nazev("");
    onChangeText_misto("");
    onChangeText_popis("");

    const collectionRef = collection(db, "Calendar");
    const payload = {
      DogID: dog.id,
      Name: text_nazev,
      Description: text_popis,
      Place: text_misto,
      DateOfEvent: normalFormatDate,
      TimeOfEvent: normalFormatTime,
      SelectedEvent: selectedEvent,
      SelectedColor: selectedColor,
    };
    await addDoc(collectionRef, payload);
  };

  const handleDeleteEvent = async (event) => {
    console.log("handle delete calendar event");
    const collectionRef = collection(db, "Calendar");
    const docRef = doc(collectionRef, event.id);
    await deleteDoc(docRef);
  };

  const renderEvent = ({ item }) => {
    const dateOfEvent = item.data.DateOfEvent;
    const selectedColor = item.data.SelectedColor;

    return (
      <View
        style={{
          backgroundColor: "white",
          borderColor: "grey",
          borderWidth: 0.2,
          borderRadius: 10,
          //width: "96%",
          width: width * 0.96,
          alignSelf: "center",
          marginTop: "1%",
        }}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: "2%",
              marginTop: "1%",
            }}
          >
            <Text style={{ color: selectedColor, fontSize: 18 }}>
              {item.data.Name}
            </Text>
            <Text>{item.data.TimeOfEvent}</Text>
            <Text style={{ marginLeft: 20, fontSize: 16 }}>{dateOfEvent}</Text>
          </View>
          {item.data.Description && (
            <Text
              style={{ width: width * 0.95, alignSelf: "center", marginTop: "1%" }}
            >
              {item.data.Description}
            </Text>
          )}
        </View>
        <AntDesign
          name="delete"
          size={24}
          color="red"
          onPress={handleDeleteEvent}
          style={{ marginLeft: "auto", marginRight: 10, marginTop: "1%" }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={showModal}
          screenOptions={{ presentation: "modal" }}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          <ScrollView>
            {/*All views of Modal*/}
            {/*Animation can be slide, slide, none*/}
            <View style={styles.modal}>
              <LottieView
                source={require("../../assets/animations/animation_calendar.json")}
                autoPlay={true}
                loop={true}
                style={{
                  width: 275,
                  height: 275,
                  alignSelf: "center",
                  marginTop: "30%",
                }}
              />
              <View style={styles.eventNameWrapper}>
                <Text style={styles.textStyle}>{nameOfEventText}</Text>
                <TextInput
                  style={styles.textStyle}
                  onChangeText={onChangeText_nazev}
                  placeholder={nameOfEventText}
                  value={text_nazev}
                />
              </View>
              <View style={styles.eventTextWrapper}>
                <Text style={styles.textStyle}>{descOfEventText}</Text>
                <TextInput
                  style={styles.textStyle}
                  onChangeText={onChangeText_popis}
                  placeholder={descOfEventText}
                  value={text_popis}
                />
              </View>
              <View style={styles.eventPlaceWrapper}>
                <Text style={styles.textStyle}>{placeOfEventText}</Text>
                <TextInput
                  style={styles.textStyle}
                  onChangeText={onChangeText_misto}
                  placeholder={placeOfEventText}
                  value={text_misto}
                />
              </View>
              {/* The button that used to trigger the date picker */}
              <View style={styles.eventTimeWrapper}>
                <Text style={styles.textStyle}>Čas události</Text>
                <RNDateTimePicker
                  mode="time"
                  display="clock"
                  value={new Date()}
                />
              </View>
              <View style={styles.eventTextWrapper}>
                <Text style={styles.textStyle}>{colorToPickText}</Text>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={colorData}
                  labelField="label"
                  valueField="value"
                  searchPlaceholder="Hledat..."
                  value={valueColor}
                  dropdownPosition="top"
                  maxHeight={300}
                  onChange={(item) => {
                    setValueColor(item.value);
                    setIsFocus(false);
                  }}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                />
              </View>
              <View style={styles.modalButtonWrapper}>
                <Button
                  title={btnCancelEventText}
                  onPress={() => setShowModal(!showModal)}
                />
                <Button title={btnCreateEventText} onPress={handleNew} />
              </View>
            </View>
          </ScrollView>
        </Modal>
        <View
          style={{
            height: height,
          }}
        >
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo
                name="chevron-thin-left"
                size={28}
                color="black"
                style={styles.goingBack}
              ></Entypo>
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 30,
                margin: 5,
              }}
            >
              {nameOfScreenText}
            </Text>
          </View>
          <Calendar
            // Customize the appearance of the calendar
            style={{
              margin: 5,
            }}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e",
            }}
            current={toDay}
            // Callback that gets called when the user selects a day
            onDayPress={(day) => {
              setDateOfEvent(day.dateString);

              setShowModal(!showModal);
            }}
            // Mark specific dates as marked
            markedDates={markedEventsSaved}
          />
          <View style={styles.lineStyle} />
          <Text style={styles.upcomingEventStyle}>Nadcházející události:</Text>
          <FlatList
            style={styles.flatListItem}
            data={savedEvents}
            renderItem={renderEvent}
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
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    marginTop: 30,
  },
  modal: {
    flex: 1,
  },
  text: {
    color: "#3f2949",
    marginTop: 10,
  },
  btnContainer: {
    padding: 30,
  },
  // This only works on iOS
  datePicker: {
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  lineStyle: {
    borderWidth: 0.3,
    borderColor: "darkgrey",
    margin: 5,
  },
  eventNameWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "20%",
  },
  eventTextWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "10%",
  },
  eventPlaceWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "10%",
  },
  eventTimeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "5%",
    marginTop: "10%",
    textAlign: "center",
  },
  modalButtonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5%",
    marginHorizontal: "20%",
  },
  textStyle: {
    fontSize: 18,
  },
  headerWrapper: {
    marginTop: "5%",
    marginBottom: "5%",
    marginHorizontal: "3%",
    flexDirection: "row",
  },
  goingBack: {
    marginTop: "25%",
    marginLeft: "3%",
  },
  upcomingEventStyle: {
    fontSize: 20,
    marginTop: "1%",
    marginLeft: "3%",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    //width: "30%",
    width: width * 0.3,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

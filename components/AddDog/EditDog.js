import * as React from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useState } from "react";
import {
  updateDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import {db} from '../../firebaseConfig';

const { width, height } = Dimensions.get("window");

export default function EditDog({ route, navigation }) {
  const { item } = route.params;

  const [textName, setTextName] = useState("");
  const [textBreed, setTextBreed] = useState("");
  const [newImage, setImage] = useState("");
  //const [photoSelected, setPhotoSelected] = useState(false);
  const defaultName = item.Name;
  const defaultBreed = item.Breed;

  const nameOfDogText = "Jméno";
  const editDogText = "Úprava pejska " + item.Name;
  const petBreedText = "Plemeno";
  const editDogTextBtn = "Upravit";
  const photoOfDogText = "Fotka";
  const pickPhotoText = "Vybrat fotku";

  const handleEdit = async () => {
    await updateDoc(doc(db, "Dogs", item.id), {
      Breed: textBreed,
      Name: textName,
      Photo: newImage,
    });
    navigation.goBack();
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
      console.log(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
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
          <Text style={styles.headerText}>{editDogText}</Text>
        </View>

        <Image
          source={{ uri: item.Photo }}
          style={{
            width: width * 0.8,
            height: width * 0.7,
            alignSelf: "center",
            marginTop: '3%',
          }}
        />

        <View>
          <View style={styles.nameWrapper}>
            <Text style={styles.nameTextStyle}>{nameOfDogText}</Text>
            <TextInput
              style={styles.inputName}
              placeholder={defaultName}
              onChangeText={(newText) => setTextName(newText)}
              defaultValue={defaultName}
            />
          </View>
          {/* DOB bylo tady */}
          <View style={styles.breedWrapper}>
            <Text style={styles.breedTextStyle}>{petBreedText}</Text>
            <TextInput
              style={styles.inputBreed}
              placeholder={defaultBreed}
              onChangeText={(newTextBreed) => setTextBreed(newTextBreed)}
              defaultValue={defaultBreed}
            />
          </View>
          <View style={styles.photoWrapper}>
            <Text style={styles.photoTextStyle}>{photoOfDogText}</Text>
            <Button title={pickPhotoText} onPress={pickImage} />
          </View>
          <View style={styles.bottomWrapper}>
            <Button title={editDogTextBtn} onPress={handleEdit} />
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
    marginLeft: '2%',
  },
  headerText: {
    marginLeft: "3%",
    fontSize: 32,
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
});

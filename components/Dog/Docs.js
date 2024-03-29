import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Button,
  Dimensions,
  Alert
} from "react-native";
import db from '../../firebaseConfig';
import {
  onSnapshot,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  storage,
  getStorage,
  uploadBytesResumable,
  put,
} from "firebase/storage";
import { Entypo } from "@expo/vector-icons";
import uuid from "react-native-uuid";

export default function Docs({ route, navigation }) {
  const { item } = route.params;
  const [documents, setDocuments] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const numberOfColumns = 3;

  useEffect(() => {
    setDocuments([]);
    const storage = getStorage();
    const documentsListRef = ref(storage, `userDocuments/${item.id}`);
    listAll(documentsListRef).then((response) => {
      response.items.forEach((document) => {
        getDownloadURL(document).then((url) => {
          let docName = document.name;
          setDocuments((prevDocuments) => [...prevDocuments, {url, docName}]);
        });
      });
    });
  }, []);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (!result.canceled) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", result.uri, true);
        xhr.send(null);
      });
      const storage = getStorage();
      const refs = ref(storage, `userDocuments/${item.id}/${result.name+uuid.v4()}`);
      const metadata = { contentType: "document" };
      await uploadBytesResumable(refs, blob, metadata);
      blob.close();
    }
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
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", result.assets[0].uri, true);
        xhr.send(null);
      });
      const storage = getStorage();
      const refs = ref(
        storage,
        `userDocuments/${item.id}/${uuid.v4()}`
      );
      const metadata = { contentType: "image/jpeg" };
      await uploadBytesResumable(refs, blob, metadata).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setDocuments((prevDocuments) => [...prevDocuments, url]);
        });
      });
      blob.close();
    }
  };

  //renderDocuments
  const renderDocuments = ( {item} ) => {
    let isPdfFile = false;
    isPdfFile = item.docName.includes('pdf');
    return (
        <View style={{flexDirection: "row", margin: 5}}>
        <TouchableOpacity
        key={uuid.v4()}
        style={{height: screenWidth * 0.3, width: screenWidth * 0.3, justifyContent: 'space-evenly'}}
        onLongPress={() => {
          Alert.alert(
            "Odstranit dokument",
            "Opravdu chcete smazat dokument?",
            [
              {
                text: "Ano",
                onPress: () => {
                  deleteDocument(item.name);
                },
              },
              { text: "Ne", style: "cancel" },
            ],
            { cancelable: true }
          );
        }}
        >
        { !isPdfFile && <Image source={{ uri: item.url }} style={{ width: screenWidth * 0.3, height: screenWidth * 0.3 }} />}
        { isPdfFile && <View><Image source={require('../../assets/pictures/pdf_file.png')} style={{ width: screenWidth * 0.3, height: screenWidth * 0.27 }} /><Text>{item.docName}</Text></View>}
        </TouchableOpacity>
        </View>
    )};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo
              name="chevron-thin-left"
              size={28}
              color="black"
              style={styles.goingBack}
            ></Entypo>
          </TouchableOpacity>

          <Text style={styles.headerText}>Dokumenty</Text>
        </View>
        <View style={{flexDirection: "row", flexWrap: "wrap", marginTop: '2%'}}>
        <FlatList
          data={documents}
          keyExtractor={(item) => item.name}
          renderItem={renderDocuments}
          numColumns={numberOfColumns}
        />
        </View>
        <View style={styles.bottomButtonsStyle}>
          <Button title="Nahrát nový dokument" onPress={pickDocument} />
          <Button title="Nahrát novou fotku" onPress={pickImage} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  goingBack: {
    marginTop: "25%",
    marginLeft: "3%",
  },
  headerWrapper: {
    marginTop: "5%",
    marginHorizontal: "3%",
    flexDirection: "row",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 30,
    margin: 5,
  },
  bottomButtonsStyle: {
    justifyContent: "space-around",
    flexDirection: "row",
    marginHorizontal: "6%",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
});

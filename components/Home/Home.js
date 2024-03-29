import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
//import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import "firebase/firestore";
import { signOut } from "firebase/auth";
import { collection, query, getDocs, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../firebaseConfig";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useIsFocused } from "@react-navigation/native";

export default function Home({ navigation }) {
  const myDogsText = "Moji pejsci";
  //const [user, setUser] = useState("");
  const [dogs, setDogs] = useState("");
  const user = auth.currentUser;
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      const collectionRef = collection(db, "Dogs");
      const q = query(collectionRef, where("UserId", "==", user.uid));
      const snapshot = await getDocs(q);
      if (snapshot.empty) console.log("No dogs found");
      setDogs(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    fetchData();
  }, [isFocused]);

  const handleLogOut = () => {
    console.log("Odhlasuju se...");
    signOut(auth).then(() => {
      navigation.replace("Login");
    });
    return true;
  };

  const renderPetItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigation.navigate("Dog", { item: item })}
      >
        <View style={styles.flatListWrapper}>
          <Image source={{ uri: item.Photo }} style={styles.petItemImage} />
          <Text style={styles.petNameText}>{item.Name}</Text>
          <AntDesign
            name="right"
            size={28}
            color="black"
            style={styles.rightIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.menuStyle}>
          <Menu onClose={() => console.log("menu is closing")}>
            <MenuTrigger>
              <AntDesign name="user" size={42} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption text={user.email} />
              <MenuOption onSelect={() => handleLogOut()}>
                <Text style={{ color: "red" }}>Odhlásit se</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <View style={styles.headerWrapper}>
          {/* Text */}

          <Text style={styles.headerText}>{myDogsText}</Text>
          {/* Plus */}
          <TouchableOpacity
            onPress={() => navigation.navigate("AddDog", { item: user })}
          >
            <AntDesign name="plus" size={42} color={"skyblue"} />
          </TouchableOpacity>
        </View>
        {/* FlatList */}
        <View>
          <FlatList
            style={styles.flatListItem}
            data={dogs}
            renderItem={renderPetItem}
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
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  headerText: {
    fontSize: 40,
  },
  flatListWrapper: {
    color: "#808080",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    width: "95%",
    alignSelf: "center",
    marginTop: "1.5%",
    alignItems: "center",
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
  },
  flatListItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  petItemImage: {
    width: 85,
    height: 85,
    borderRadius: 40,
  },
  petNameText: {
    fontSize: 24,
    marginLeft: -20,
  },
  petAgeText: {
    fontSize: 24,
    marginLeft: -20,
  },
  readinessInfo: {
    flexDirection: "column",
  },
  readinessText: {
    fontSize: 18,
  },
  readinessPointsText: {
    fontSize: 18,
    alignSelf: "auto",
  },
  menuStyle: {
    marginLeft: "85%",
    marginTop: "10%",
  },
  rightIcon: {
    color: "gray",
  },
});

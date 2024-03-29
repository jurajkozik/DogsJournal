import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MenuProvider } from "react-native-popup-menu";

import Home from "./components/Home/Home";
import Dog from "./components/Dog/Dog";
import Docs from "./components/Dog/Docs";
import NewCustomSkill from "./components/Dog/NewCustomSkill";
import SkillOverview from "./components/Dog/SkillOverview";
import SkillDetail from "./components/Dog/SkillDetail";
import AddDog from "./components/AddDog/AddDog";
import EditDog from "./components/AddDog/EditDog";
import Journal from "./components/Journal/Journal";
import Login from "./components/Login/Login";
import HealthAdvice from "./components/HealthAdvice/HealthAdvice";
import Register from "./components/Login/Register";
import Achievements from "./components/Achievements/Achievements";
import OnboardingScreens from "./components/Login/OnboardingScreens";
import DogDetail from "./components/DogDetail/DogDetail";
import DogDetailEdit from "./components/DogDetail/DogDetailEdit";
import TrainingDiary from "./components/TrainingDiary/TrainingDiary";
import AddTrainingDiary from "./components/TrainingDiary/AddTrainingDiary";

const Stack = createNativeStackNavigator();

export default function App() {
  const [firstTimeOpened, setFirstTimeOpened] = useState(true);
  useEffect(() => {
    const checkForFirstTimeLoaded = async () => {
      const result = await AsyncStorage.getItem("isFirstTimeOpen");
      if (result === null) {
        setFirstTimeOpened(true);
        await AsyncStorage.setItem("isFirstTimeOpen", "false");
      } else {
        setFirstTimeOpened(false);
      }
    };
    checkForFirstTimeLoaded();
  }, []);

  return (
    <MenuProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
        {firstTimeOpened && <Stack.Screen name='OnboardingScreens' component={OnboardingScreens} options={{ headerShown: false }} />}
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dog"
            component={Dog}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DogDetail"
            component={DogDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DogDetailEdit"
            component={DogDetailEdit}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddDog"
            component={AddDog}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditDog"
            component={EditDog}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Journal"
            component={Journal}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Docs"
            component={Docs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewCustomSkill"
            component={NewCustomSkill}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SkillOverview"
            component={SkillOverview}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SkillDetail"
            component={SkillDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HealthAdvice"
            component={HealthAdvice}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Achievements"
            component={Achievements}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TrainingDiary"
            component={TrainingDiary}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTrainingDiary"
            component={AddTrainingDiary}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



//Screens
import HomeScreen from '../Home/Home';
import SettingsScreen from '../Settings/Settings.js';
import JournalScreen from '../Journal/Journal'
import Home from '../Home/Home';
import Dog from '../Dog/Dog'

//Screen names
const homeName = "Home";
const settingsName = "Settings";
const journalName = "Journal";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function NavContainer() {
    return (
        //<NavigationContainer independent={true}>
        //    <Stack.Navigator>
        //        <Stack.Screen name="Home" component={Home} options = {{headerShown: false,}}/>
        //    </Stack.Navigator>
        //    <Stack.Navigator>
        //        <Stack.Screen name="Dog" component={Dog} options = {{headerShown: false,}}/>
        //    </Stack.Navigator>
        //</NavigationContainer>
        <Text>Hello</Text>
    );
}

export default NavContainer;
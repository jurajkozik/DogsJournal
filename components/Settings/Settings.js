import * as React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

export default function Settings({ navigation }) {
    return (
        <View>
            <SafeAreaView>
                <Text>
                    Settings Screen
                </Text>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
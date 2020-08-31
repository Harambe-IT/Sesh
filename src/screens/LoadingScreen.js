import React, { Component } from 'react';
import {View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default class LoadingScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
                <ActivityIndicator style={{opacity: 1.0}} animating size="large" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

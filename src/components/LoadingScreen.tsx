// src/components/LoadingScreen.tsx
import React from "react";
import { View, Text, StyleSheet,Image, } from "react-native";

const LoadingScreen = () => {
	return (
		<View style={styles.container}>
			<Image
				source={require("../../assets/splash-icon.png")}
				resizeMode="contain"
			/>
			<Text style={styles.subtitle}>Conteúdo que inspira</Text>
		</View>
	);
};

export default LoadingScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
	},
	logo: {
		fontSize: 72,
		color: "#fff",
		fontWeight: "bold",
		fontFamily: "serif",
	},
	subtitle: {
		fontSize: 16,
		color: "#fff",
		marginTop: 8,
	},
});

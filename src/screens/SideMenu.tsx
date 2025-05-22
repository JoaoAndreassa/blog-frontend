import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface SideMenuProps {
	onClose: () => void;
	onLogout: () => void;
	onNavigate: (screen: string) => void;
}

const SideMenu = ({ onClose, onLogout, onNavigate }: SideMenuProps) => {
	return (
		<View style={styles.menu}>
			<View style={styles.top}>
				<Image source={require("../../assets/Logo.png")} style={styles.logo} />
				<TouchableOpacity onPress={onClose}>
					<AntDesign name="close" size={24} color="black" />
				</TouchableOpacity>
			</View>

			<View style={styles.options}>
				<TouchableOpacity onPress={() => onNavigate("EditProfile")}>
					<Text style={styles.option}>Perfil</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => onNavigate("MyArticles")}>
					<Text style={styles.option}>Meus Artigos</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => onNavigate("CreateArticle")}>
					<Text style={styles.option}>Criar novo Artigo</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity onPress={onLogout} style={styles.logout}>
				<Text style={styles.option}>Sair</Text>
			</TouchableOpacity>
		</View>
	);
};

export default SideMenu;

const styles = StyleSheet.create({
	menu: {
		position: "absolute",
		top: 0,
		left: 0,
		height: "100%",
		width: "110%",
		backgroundColor: "#fff",
		padding: 30,
		zIndex: 999,
		justifyContent: "space-between",
	},
	top: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	logo: {
		width: 37,
		height: 43,
		resizeMode: "contain",
	},
	options: {
		display: "flex",
        alignItems: "flex-end",
        marginBottom: "150%",
        gap: 23,
        
		
	},
	option: {
		fontSize: 16,
		color: "black",
        lineHeight: 20,
        fontWeight: 400,
        letterSpacing: 2

	},
	logout: {
		alignSelf: "flex-end",
	},
});

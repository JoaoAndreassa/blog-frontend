// src/components/TopBarMenu.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { AuthContext } from "../context/AuthContext";

type Props = {
	activeTab: "home" | "articles";
	setActiveTab: (tab: "home" | "articles") => void;
	menuVisible: boolean;
	setMenuVisible: (visible: boolean) => void;
	onAvatarPress: () => void;
};

const TopBarMenu: React.FC<Props> = ({
	activeTab,
	setActiveTab,
	onAvatarPress,
}) => {
	const { user } = React.useContext(AuthContext);
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	return (
		<View style={styles.topBar}>
			<View style={styles.navButtons}>
				<TouchableOpacity
					onPress={() => {
						setActiveTab("home");
						navigation.navigate("Home");
					}}
				>
					<Text style={[styles.navText, activeTab === "home" && styles.activeTab]}>
						Home
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => {
						setActiveTab("articles");
						navigation.navigate("Articles");
					}}
				>
					<Text
						style={[styles.navText, activeTab === "articles" && styles.activeTab]}
					>
						Artigos
					</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity onPress={onAvatarPress}>
				<Image
					source={
						user?.avatarUrl
							? { uri: `${user.avatarUrl}?${Date.now()}` }
							: require("../../assets/avatar.png")
					}
					style={styles.avatar}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default TopBarMenu;

const styles = StyleSheet.create({
	topBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 30,
		marginTop: 20,
	},
	navButtons: {
		flexDirection: "row",
		gap: 16,
	},
	navText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#6B7280",
		marginRight: 12,
	},
	activeTab: {
		color: "#111827",
		borderBottomWidth: 2,
		borderBottomColor: "#4F46E5",
		paddingBottom: 2,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
});

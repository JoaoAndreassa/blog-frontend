import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { AntDesign } from "@expo/vector-icons";
import TopBarMenu from "../components/TopBarMenu";
import SideMenu from "./SideMenu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type PostDetailsRouteProp = RouteProp<RootStackParamList, "PostDetails">;

const PostDetailsScreen = () => {
	const navigation =
			useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const route = useRoute<PostDetailsRouteProp>();
	const { post } = route.params;
	const [liked, setLiked] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"home" | "articles">("home");
	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const toggleLike = () => setLiked(!liked);

	function logout(): void {
		throw new Error("Function not implemented.");
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<TopBarMenu
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				menuVisible={menuVisible}
				setMenuVisible={setMenuVisible}
				onAvatarPress={() => setMenuOpen(true)} // <- aqui!
			/>
			<Image
				source={{ uri: `http://192.168.0.19:3000/articles/${post.id}/image` }}
				style={styles.image}
				resizeMode="cover"
				onError={() => console.log("Erro ao carregar imagem")}
			/>

			<Text style={styles.meta}>
				por {post.author_name} em {formatDate(post.created_at)}
			</Text>

			<View style={styles.titleRow}>
				<Text style={styles.title}>{post.title}</Text>
				<TouchableOpacity onPress={toggleLike}>
					<AntDesign
						name={liked ? "heart" : "hearto"}
						size={24}
						color={liked ? "red" : "#444"}
					/>
				</TouchableOpacity>
				
			</View>
		
			<Text style={styles.content}>{post.content}</Text>
			
		</ScrollView>
	);
};

export default PostDetailsScreen;

const styles = StyleSheet.create({
	container: {
		padding: 20,
		marginTop: 20,
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		marginBottom: 20,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 12,
		marginBottom: 10,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		flex: 1,
	},
	meta: {
		fontSize: 13,
		color: "#666",
		marginBottom: 10,
	},
	content: {
		fontSize: 16,
		lineHeight: 24,
	},
});

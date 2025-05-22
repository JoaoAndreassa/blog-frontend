// src/screens/MyArticlesScreen.tsx
import React, { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Alert,
	Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AntDesign, Feather } from "@expo/vector-icons";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import TopBarMenu from "../components/TopBarMenu";
import { RootStackParamList } from "../navigation";

interface Article {
	id: number;
	title: string;
	content: string;
	created_at: string;
	updated_at: string;
	author_name: string;
}

const MyArticlesScreen = () => {
	const { user, logout } = useContext(AuthContext);
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [articles, setArticles] = useState<Article[]>([]);
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"home" | "articles">("home");
	const loadMyArticles = async () => {
		try {
			const res = await api.get("/articles");
			const mine = res.data.filter((a: Article) => a.author_name === user?.name);
			setArticles(mine);
		} catch (err) {
			console.error("Erro ao carregar artigos:", err);
		}
	};

	useEffect(() => {
		loadMyArticles();
	}, []);

	const handleDelete = async (id: number) => {
		Alert.alert("Excluir artigo", "Tem certeza que deseja excluir este artigo?", [
			{ text: "Cancelar", style: "cancel" },
			{
				text: "Excluir",
				style: "destructive",
				onPress: async () => {
					try {
						await api.delete(`/articles/${id}`);
						setArticles((prev) => prev.filter((post) => post.id !== id));
					} catch (error) {
						Alert.alert("Erro", "Não foi possível excluir o artigo.");
					}
				},
			},
		]);
	};

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});

	const renderItem = ({ item }: { item: Article }) => (
		<View style={styles.card}>
			<Image
				source={{ uri: `http://192.168.0.19:3000/articles/${item.id}/image` }}
				style={styles.image}
			/>
			<Text style={styles.title}>{item.title}</Text>
			<Text style={styles.meta}>
				Criado em: {formatDate(item.created_at)}
				{"\n"}Alterado em: {formatDate(item.updated_at)}
			</Text>
			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => navigation.navigate("EditArticle", { article: item })}
				>
					<Feather name="edit" size={20} color="#fff" />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => handleDelete(item.id)}
				>
					<Feather name="trash-2" size={20} color="#ff3b30" />
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<TopBarMenu
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				menuVisible={menuVisible}
				setMenuVisible={setMenuVisible}
				onAvatarPress={() => setMenuOpen(true)} // <- aqui!
			/>

			<Text style={styles.header}>Meus Artigos</Text>
			<FlatList
				data={articles}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				contentContainerStyle={{ paddingVertical: 16 }}
			/>
		</View>
	);
};

export default MyArticlesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 16,
		marginTop: 20,
	},
	header: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 12,
		marginTop: 8,
	},
	card: {
		marginBottom: 16,
		padding: 12,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
	},
	image: {
		width: "100%",
		height: 150,
		borderRadius: 6,
		marginBottom: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	meta: {
		fontSize: 12,
		color: "#666",
		marginVertical: 8,
	},
	actions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
	},
	iconButton: {
		backgroundColor: "#111",
		padding: 10,
		borderRadius: 8,
	},
});

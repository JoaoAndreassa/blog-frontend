import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { api } from "../api/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import ArticleCard from "../components/ArticleCard";
import { AuthContext } from "../context/AuthContext";
import TopBarMenu from "../components/TopBarMenu";
import SideMenu from "./SideMenu";

export interface Article {
	id: number;
	title: string;
	content: string;
	created_at: string;
	author_name: string;
}

const ArticlesScreen = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [liked, setLiked] = useState<number[]>([]);
	const { user } = useContext(AuthContext);
	const [menuVisible, setMenuVisible] = useState(false);
	const [activeTab, setActiveTab] = useState<"home" | "articles">("articles");
	const [menuOpen, setMenuOpen] = useState(false);
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const loadArticles = async () => {
		try {
			const response = await api.get("/articles");
			setArticles(
				response.data.filter((post: Article) => post.author_name !== user?.name)
			);
		} catch (error) {
			console.error("Erro ao carregar artigos:", error);
		}
	};

	useEffect(() => {
		loadArticles();
	}, []);

	const toggleLike = (id: number) => {
		setLiked((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	const renderItem = ({ item }: { item: Article }) => (
		<TouchableOpacity
			onPress={() => navigation.navigate("PostDetails", { post: item })}
		>
			<ArticleCard
				id={item.id}
				title={item.title}
				content={item.content}
				created_at={item.created_at}
				author_name={item.author_name}
				liked={liked.includes(item.id)}
				onToggleLike={() => toggleLike(item.id)}
			/>
		</TouchableOpacity>
	);

  function logout(): void {
    throw new Error("Function not implemented.");
  }

	return (
		<View style={styles.container}>
			<TopBarMenu
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				menuVisible={menuVisible}
				setMenuVisible={setMenuVisible}
				onAvatarPress={() => setMenuOpen(true)} 
			/>
			<FlatList
				data={articles}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				contentContainerStyle={{ paddingVertical: 16 }}
			/>
      {menuOpen && (
				<SideMenu
					onClose={() => setMenuOpen(false)}
					onLogout={logout}
					onNavigate={(screen) => {
						setMenuOpen(false);
						navigation.navigate(screen as any);
					}}
				/>
			)}
		</View>
	);
};

export default ArticlesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		marginTop: 15,
		backgroundColor: "#fff",
	},
});

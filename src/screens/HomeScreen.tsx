import React, { useState, useContext, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import SideMenu from "./SideMenu";
import TopBarMenu from "../components/TopBarMenu";
import ArticleCard from "../components/ArticleCard";

interface Post {
	id: number;
	title: string;
	content: string;
	created_at: string;
	author_name: string;
}

const HomeScreen = () => {
	const { user, logout, refreshUser } = useContext(AuthContext);
	const [myPosts, setMyPosts] = useState<Post[]>([]);
	const [otherPosts, setOtherPosts] = useState<Post[]>([]);
	const [liked, setLiked] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);
	const [menuVisible, setMenuVisible] = useState(false);
	const [activeTab, setActiveTab] = useState<"home" | "articles">("home");
	const [menuOpen, setMenuOpen] = useState(false);

	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const loadPosts = async () => {
		try {
			const response = await api.get("/articles");
			const allPosts: Post[] = response.data;

			const mine = allPosts.filter((post) => post.author_name === user?.name);
			const others = allPosts.filter((post) => post.author_name !== user?.name);

			setMyPosts(mine);
			setOtherPosts(others);
		} catch (error) {
			console.error("Erro ao carregar posts:", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			refreshUser();
			loadPosts();
		}, [])
	);

	const toggleLike = (id: number) => {
		setLiked((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	const renderItem = ({ item }: { item: Post }) => (
		<TouchableOpacity
			onPress={() => navigation.navigate("PostDetails", { post: item })}
		>
			<ArticleCard
				id={item.id}
				title={item.title}
				content={item.content}
				created_at={item.created_at}
				author_name={item.author_name}
				liked={null}
				onToggleLike={() => toggleLike(item.id)}
			/>
		</TouchableOpacity>
	);

	if (loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator size="large" color="#4F46E5" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<TopBarMenu
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				menuVisible={menuVisible}
				setMenuVisible={setMenuVisible}
				onAvatarPress={() => setMenuOpen(true)} // <- aqui!
			/>

			{activeTab === "home" ? (
				myPosts.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>Você não tem nenhum post</Text>
					</View>
				) : (
					<FlatList
						data={myPosts}
						keyExtractor={(item) => item.id.toString()}
						renderItem={renderItem}
						contentContainerStyle={{ paddingTop: 12 }}
					/>
				)
			) : (
				<FlatList
					data={otherPosts}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderItem}
					contentContainerStyle={{ paddingTop: 12 }}
				/>
			)}
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

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		marginTop: 15,
		backgroundColor: "#fff",
	},
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 60,
	},
	emptyText: {
		fontSize: 16,
		color: "#555",
		textAlign: "center",
	},
});

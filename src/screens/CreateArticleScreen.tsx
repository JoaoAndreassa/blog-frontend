import React, { useState, useContext } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Image,
	Alert,
	ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import TopBarMenu from "../components/TopBarMenu";

const CreateArticleScreen = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const { token } = useContext(AuthContext);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"home" | "articles">("home");

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [16, 9],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const handleSubmit = async () => {
		if (!title || !content) {
			Alert.alert("Erro", "Preencha o título e o texto do artigo.");
			return;
		}

		const formData = new FormData();
		formData.append("title", title);
		formData.append("content", content);

		if (image && image.startsWith("file")) {
			const ext = image.split(".").pop() || "jpg";
			formData.append("image", {
				uri: image,
				name: `article.${ext}`,
				type: "image/jpeg",
			} as any);
		}

		try {
			await fetch("http://192.168.0.19:3000/articles", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			Alert.alert("Sucesso", "Artigo criado com sucesso!");
			navigation.navigate("Home");
		} catch (err) {
			console.error("Erro ao criar artigo:", err);
			Alert.alert("Erro", "Não foi possível criar o artigo.");
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<TopBarMenu
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				menuVisible={menuVisible}
				setMenuVisible={setMenuVisible}
				onAvatarPress={() => setMenuOpen(true)} // <- aqui!
			/>
			<Text style={styles.title}>Criar Artigo</Text>

			<Text style={styles.label}>Banner</Text>
			<TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
				{image ? (
					<Image source={{ uri: image }} style={styles.image} />
				) : (
					<Text style={styles.placeholder}>Adicione uma imagem</Text>
				)}
			</TouchableOpacity>

			<Text style={styles.label}>Título</Text>
			<TextInput
				style={styles.input}
				value={title}
				onChangeText={setTitle}
				placeholder="Adicione um título"
			/>

			<Text style={styles.label}>Texto</Text>
			<TextInput
				style={styles.textArea}
				multiline
				numberOfLines={10}
				value={content}
				onChangeText={setContent}
				placeholder="Escreva seu artigo"
			/>

			<TouchableOpacity style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>Salvar</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

export default CreateArticleScreen;

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#fff",
		marginTop: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 6,
		color: "#333",
	},
	imagePicker: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 6,
		padding: 10,
		marginBottom: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholder: {
		color: "#888",
	},
	image: {
		width: "100%",
		height: 150,
		borderRadius: 6,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 6,
		padding: 10,
		marginBottom: 16,
	},
	textArea: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 6,
		padding: 10,
		height: 180,
		marginBottom: 16,
		textAlignVertical: "top",
	},
	button: {
		backgroundColor: "#111",
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
	},
});

import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Image,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";

const EditProfileScreen = () => {
	const { token, refreshUser } = useContext(AuthContext);
	const [avatarUrl, setAvatar] = useState<string | null>(null);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigation =
			useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const loadUser = async () => {
		try {
			const response = await api.get("/auth/me");
			const u = response.data;
			setFirstName(u.firstName || "");
			setLastName(u.lastName || "");
			setEmail(u.email || "");
			setAvatar(u.avatarUrl || null);
		} catch (err) {
			console.error("Erro ao carregar perfil:", err);
		}
	};

	useEffect(() => {
		loadUser();
	}, []);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.4,
		});

		if (!result.canceled) {
			setAvatar(result.assets[0].uri);
		}
	};

	const getMimeType = (uri: string): string => {
		const extension = uri.split(".").pop()?.toLowerCase();
		if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
		if (extension === "png") return "image/png";
		if (extension === "gif") return "image/gif";
		return "application/octet-stream";
	};

	const handleSave = async () => {

		if (password && password !== confirmPassword) {
			Alert.alert("Erro", "As senhas não coincidem!");
			return;
		}

		const formData = new FormData();
		formData.append("firstName", firstName || "SemNome");
		formData.append("lastName", lastName || "SemSobrenome");

		if (password) {
			formData.append("password", password);
		}

		if (avatarUrl && avatarUrl.startsWith("file")) {
			const ext = avatarUrl.split(".").pop() || "jpg";
			const mimeType = getMimeType(avatarUrl);

			const base64Image = await FileSystem.readAsStringAsync(avatarUrl, {
				encoding: FileSystem.EncodingType.Base64,
			});

			formData.append("avatar", {
				uri: avatarUrl,
				name: "avatar.jpg",
				type: "image/jpeg",
			} as any);
		}

		try {
			await fetch("http://192.168.0.19:3000/auth/me", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			await refreshUser();
			Alert.alert("Sucesso", "Perfil atualizado!");
			navigation.navigate("Home");
		} catch (error) {
			console.error("❌ Erro ao salvar perfil:", error);
			Alert.alert("Erro", "Não foi possível salvar o perfil.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Perfil</Text>

			<Text style={styles.label}>Avatar</Text>
			<TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
				<Image
					source={
						avatarUrl ? { uri: avatarUrl } : require("../../assets/avatar.png")
					}
					style={styles.avatar}
				/>
			</TouchableOpacity>
			{avatarUrl && avatarUrl.startsWith("file") && (
				<Text style={styles.fileName}>{avatarUrl.split("/").pop()}</Text>
			)}

			<Text style={styles.label}>Nome</Text>
			<TextInput
				style={styles.input}
				value={firstName}
				onChangeText={setFirstName}
				placeholder="Nome"
			/>

			<Text style={styles.label}>Sobrenome</Text>
			<TextInput
				style={styles.input}
				value={lastName}
				onChangeText={setLastName}
				placeholder="Sobrenome"
			/>

			<Text style={styles.label}>Email</Text>
			<TextInput
				style={[styles.input, styles.disabled]}
				value={email}
				editable={false}
			/>

			<Text style={styles.label}>Senha</Text>
			<TextInput
				style={styles.input}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				placeholder="Nova senha"
			/>

			<Text style={styles.label}>Confirmar senha</Text>
			<TextInput
				style={styles.input}
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				secureTextEntry
				placeholder="Confirmar nova senha"
			/>

			<TouchableOpacity onPress={handleSave} style={styles.button}>
				<Text style={styles.buttonText}>Salvar</Text>
			</TouchableOpacity>
		</View>
	);
};

export default EditProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
		marginTop:15,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		marginTop: 10,
		marginBottom: 4,
		color: "#1F2937",
	},
	avatarWrapper: {
		alignSelf: "flex-start",
		marginBottom: 10,
	},
	avatar: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#eee",
	},
	fileName: {
		fontSize: 12,
		color: "#888",
		marginBottom: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 6,
		padding: 10,
		fontSize: 14,
		marginBottom: 8,
	},
	disabled: {
		backgroundColor: "#f3f3f3",
		color: "#999",
	},
	button: {
		marginTop: 20,
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

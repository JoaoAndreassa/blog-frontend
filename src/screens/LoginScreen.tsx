import React, { useContext, useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

const LoginScreen = () => {
	const { login } = useContext(AuthContext);
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			await login(email, password);
		} catch (err) {
			alert("Credenciais inválidas");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Entrar</Text>

			<TextInput
				style={styles.input}
				placeholder="E-mail"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
			/>

			<TextInput
				style={styles.input}
				placeholder="Senha"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>

			<Button title="Entrar" onPress={handleLogin} />
			<TouchableOpacity
				onPress={() => navigation.navigate("ForgotPassword")}
				style={styles.link}
			>
				<Text style={styles.registerText}>Esqueci minha senha</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => navigation.navigate("Register")}
				style={styles.registerButton}
			>
				<Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
			</TouchableOpacity>
		</View>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	},
	link: {
		marginTop: 10,
		alignItems: "center",
	},

	registerButton: {
		marginTop: 15,
		alignItems: "center",
	},
	registerText: {
		color: "#4F46E5",
		fontSize: 14,
	},
});

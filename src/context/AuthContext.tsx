import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api/api";
import LoadingScreen from "../components/LoadingScreen";

interface User {
	avatarUrl: Blob;
	id: number;
	name: string;
	email: string;
}

interface AuthContextProps {
	user: User;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
	refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(
	{} as AuthContextProps
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);

	useEffect(() => {
		const loadStorage = async () => {
			const storedToken = await AsyncStorage.getItem("token");
			const storedUser = await AsyncStorage.getItem("user");

			if (storedToken && storedUser) {
				setToken(storedToken);
				setUser(JSON.parse(storedUser));
				api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
			}

			setLoadingUser(false);
		};

		loadStorage();
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const response = await api.post("/auth/login", { email, password });
			const { token, user } = response.data;

			setToken(token);
			setUser(user);

			// ✅ Salvar no AsyncStorage
			await AsyncStorage.setItem("token", token);
			await AsyncStorage.setItem("user", JSON.stringify(user));

			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} catch (error) {
			throw new Error("Credenciais inválidas");
		}
	};

	const logout = async () => {
		setToken(null);
		setUser(null);
		await AsyncStorage.removeItem("token");
		await AsyncStorage.removeItem("user");
	};

	const refreshUser = async () => {
		if (!token) return;
		try {
			const response = await api.get("/auth/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setUser(response.data);
			await AsyncStorage.setItem("user", JSON.stringify(response.data));
		} catch (err) {
			console.error("Erro ao atualizar dados do usuário:", err);
		}
	};
	if (loadingUser) {
		return <LoadingScreen />;
	}
	return (
		<AuthContext.Provider
			value={{ user, token, login, logout, isAuthenticated: !!token, refreshUser }}
		>
			{loadingUser ? <LoadingScreen /> : children}
		</AuthContext.Provider>
	);
};

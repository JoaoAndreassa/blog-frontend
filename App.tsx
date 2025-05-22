import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import { RootNavigator } from "./src/navigation";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
	return (
		<AuthProvider>
			<PaperProvider>
				<NavigationContainer>
					<RootNavigator />
				</NavigationContainer>
			</PaperProvider>
		</AuthProvider>
	);
}

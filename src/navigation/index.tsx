import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ArticlesScreen from "../screens/ArticlesScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import CreateArticleScreen from "../screens/CreateArticleScreen";
import MyArticlesScreen from "../screens/MyArticleScreen";
import EditArticleScreen from "../screens/EditArticleScreen";
import type { Article } from "../screens/ArticlesScreen";

export type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	Home: undefined;
	ForgotPassword: undefined;
	Articles: undefined;
	EditProfile: undefined;
	EditArticle: { article: Article };

	PostDetails: {
		post: {
			id: number;
			title: string;
			content: string;
			created_at: string;
			author_name: string;
		};
	};
};

const Stack = createNativeStackNavigator() as any;

export const RootNavigator = () => {
	const { isAuthenticated } = useContext(AuthContext);

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{isAuthenticated ? (
				<>
					<>
						<Stack.Screen name="Home" component={HomeScreen} />
						<Stack.Screen name="EditProfile" component={EditProfileScreen} />
						<Stack.Screen name="PostDetails" component={PostDetailsScreen} />
						<Stack.Screen name="Articles" component={ArticlesScreen} />
						<Stack.Screen name="CreateArticle" component={CreateArticleScreen} />
						<Stack.Screen name="MyArticles" component={MyArticlesScreen} />
						<Stack.Screen name="EditArticle" component={EditArticleScreen} />
					</>
				</>
			) : (
				<>
					<Stack.Screen name="Login" component={LoginScreen} />
					<Stack.Screen name="Register" component={RegisterScreen} />
					<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
				</>
			)}
		</Stack.Navigator>
	);
};

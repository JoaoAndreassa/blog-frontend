import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_name: string;
  liked: boolean;
  onToggleLike: () => void;
}

const ArticleCard: React.FC<Props> = ({
  id,
  title,
  content,
  created_at,
  author_name,
  liked,
  onToggleLike,
}) => {
  const navigation = useNavigation<any>();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <TouchableOpacity onPress={() => navigation.navigate("PostDetails", { post: { id, title, content, created_at, author_name } })}>
      <View style={styles.card}>
        <Image
          source={{ uri: `http://192.168.0.19:3000/articles/${id}/image` }}
          style={styles.image}
        />
        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.content}>
          {content.length > 100 ? content.slice(0, 100) + "..." : content}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.meta}>
            Por {author_name} – {formatDate(created_at)}
          </Text>
          <TouchableOpacity onPress={onToggleLike}>
            <AntDesign
              name={liked ? "heart" : "hearto"}
              size={20}
              color={liked ? "red" : "#444"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ArticleCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    paddingBottom: 15,
  },
  image: {
    width: '100%',
    height: 180,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 12,
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 8,
  },
  meta: {
    fontSize: 12,
    color: '#666',
  },
});

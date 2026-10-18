import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Post = {
    id: string;
    userId: string;
    username: string;
    profileImage: string;

    content: string;
    image: string | null;

    views: number;
    likes: number;
    dislikes: number;

    createdAt: string;
    updatedAt: string;
};

type PostCardProps = {
    post: Post;
    currentUserId: string;
};

export default function PostCard({ post, currentUserId, }: PostCardProps) {

    const isOwner = post.userId === currentUserId;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <View style={[styles.postCard, isMenuOpen && styles.postCardMenuOpen]}>

            {/* Post Header */}
            <View style={styles.header}>
                <Image
                    source={{ uri: post.profileImage }}
                    style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>
                        {post.username}
                    </Text>
                    <Text style={styles.timestamp}>
                        {post.createdAt}
                    </Text>
                </View>
                {isOwner && (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Post settings"
                        accessibilityState={{ expanded: isMenuOpen }}
                        onPress={() => setIsMenuOpen((isOpen) => !isOpen)}
                        style={styles.postOptionsButton}
                    >
                        <IconSymbol name="gearshape.fill" size={20} color="#8CB8E8" />
                    </TouchableOpacity>
                )}
            </View>

            {isMenuOpen && isOwner && (
                <View style={styles.postOptionsMenu}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() => setIsMenuOpen(false)}
                        style={styles.postOptionsMenuItem}
                    >
                        <Text style={styles.controlText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() => setIsMenuOpen(false)}
                        style={styles.postOptionsMenuItem}
                    >
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Post Content */}
            <Text style={styles.content}>
                {post.content}
            </Text>

            {/* Optional Post Image */}
            {post.image && (
                <Image
                    source={{ uri: post.image }}
                    style={styles.postImage}
                    resizeMode='cover'
                />
            )}

            {/* Statistics */}
            <View style={styles.statistics}>

                <Text style={styles.statText}>
                    👁 {post.views}
                </Text>
                
                <Text style={styles.statText}>
                    ❤️ {post.likes}
                </Text>

                <Text style={styles.statText}>
                    👎 {post.dislikes}
                </Text>

            </View>

            {/* Actions */}
            <View style={styles.actions}>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>
                        ❤️ Like
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>
                        👎 Dislike
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  postCard: {
    position: 'relative',
    padding: 15,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#303438',
    backgroundColor: '#151718',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },

  userInfo: {
    flex: 1,
  },

  postOptionsButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 19,
    backgroundColor: '#202830',
  },

  postCardMenuOpen: {
    zIndex: 10,
    elevation: 10,
  },

  postOptionsMenu: {
    position: 'absolute',
    top: 64,
    right: 15,
    zIndex: 20,
    minWidth: 120,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#3B4652',
    borderRadius: 10,
    backgroundColor: '#202830',
    elevation: 12,
  },

  postOptionsMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8CB8E8',
  },

  timestamp: {
    fontSize: 12,
    color: '#A3ADB7',
    marginTop: 2,
  },

  ownerControls: {
    flexDirection: 'row',
    gap: 12,
  },

  controlText: {
    fontSize: 14,
    color: '#8CB8E8',
  },

  deleteText: {
    fontSize: 14,
    color: '#A3ADB7',
  },

  content: {
    fontSize: 16,
    lineHeight: 22,
    color: '#F3F5F7',
    marginBottom: 12,
  },

  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },

  statistics: {
    flexDirection: 'row',
    gap: 20,
    paddingBottom: 10,
  },

  statText: {
    fontSize: 13,
    color: '#A3ADB7',
  },

  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#303438',
    paddingTop: 10,
  },

  actionButton: {
    marginRight: 25,
  },

  actionText: {
    fontSize: 14,
    color: '#8CB8E8',
  },
});
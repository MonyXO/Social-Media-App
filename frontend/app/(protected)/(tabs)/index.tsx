import { View, Text, Image, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PostCard from '@/components/timeline/postcard';
import React, { useEffect, useState } from 'react';
import api from '@/api/api';

export default function HomeScreen() {
  const [fullName, setFullName] = useState('');
  const [posts, setPosts] = useState([
    {
      id: '1',
      userId: '1',
      username: 'John Doe',
      profileImage: 'https://img.icons8.com/?size=100&id=7819&format=png&color=000000',
      content: 'This is my first post!',
      image: null,
      views: 125,
      likes: 12,
      dislikes: 2,
      createdAt: '2 hours ago',
      updatedAt: '1 hour ago',
    },
    {
      id: '2',
      userId: '2',
      username: 'Jane Doe',
      profileImage: 'https://img.icons8.com/?size=100&id=7819&format=png&color=000000',
      content: 'Having a great day.',
      image: 'https://img.icons8.com/?size=100&id=7819&format=png&color=000000',
      views: 248,
      likes: 24,
      dislikes: 1,
      createdAt: '5 hours ago',
      updatedAt: '5 hours ago',
    },
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { openComposer } = useLocalSearchParams<{ openComposer?: string }>();
  const router = useRouter();

  // Call to fetch current user data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/profile');
        const { firstName, lastName } = response.data;
        setFullName([firstName, lastName].filter(Boolean).join(' '));
      } catch (error) {
        console.error('Unable to load profile:', error);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (openComposer) {
      setIsCreatingPost(true);
      router.setParams({ openComposer: undefined });
    }
  }, [openComposer, router]);

  const createPost = () => {
    if (newPostContent.trim() === '') {
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      userId: '1',
      username: 'John Doe',
      profileImage: 'https://img.icons8.com/?size=100&id=7819&format=png&color=000000',
      content: newPostContent.trim(),
      image: null,
      views: 0,
      likes: 0,
      dislikes: 0,
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
    setNewPostContent('');
    setIsCreatingPost(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor='#101315' />
      <View style={styles.safeAreaDivider} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: 'https://img.icons8.com/?size=100&id=7819&format=png&color=000000' }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{fullName || 'Your Name'}</Text>
            <Text style={styles.profileUsername}>@Username</Text>
            <View style={styles.profileStatsDivider} />
            <View style={styles.statContainer}>
              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>Followers</Text>
                <Text style={styles.statNumber}>1,542</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>Likes</Text>
                <Text style={styles.statNumber}>8443</Text>
              </View>
            </View>
          </View>

          <View style={styles.timelineSection}>
            {isCreatingPost && (
              <View style={styles.createPostContainer}>
                <Text style={styles.createPostTitle}>Create Post</Text>
                <TextInput
                  style={styles.postInput}
                  placeholder="What's ony your mind?"
                  multiline
                  value={newPostContent}
                  onChangeText={setNewPostContent}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  onPress={() => Keyboard.dismiss()}
                  style={styles.doneButton}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
                <View style={styles.createPostActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      setNewPostContent('');
                      setIsCreatingPost(false);
                    }}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postButton} onPress={createPost}>
                    <Text style={styles.postButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <PostCard post={item} currentUserId="1" />
              )}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={styles.postList}
              contentContainerStyle={styles.postListContent}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101315',
  },
  safeAreaDivider: {
    height: 1,
    backgroundColor: '#303438',
  },
  profileSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: '#303438',
    backgroundColor: '#151718',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F3F5F7',
  },
  profileUsername: {
    fontSize: 15,
    color: '#A3ADB7',
  },
  profileStatsDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#303438',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 0,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: '#3B4652',
  },
  statLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A3ADB7',
    marginBottom: 3,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F3F5F7',
  },
  timelineSection: {
    flex: 2,
    padding: 0,
  },
  postList: {
    flex: 1,
  },
  postListContent: {
    padding: 0,
  },
  createPostContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    margin: 12,
    backgroundColor: '#fff',
  },
  createPostTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  doneButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  doneButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

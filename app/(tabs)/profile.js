
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useRouter, useFocusEffect } from 'expo-router';

import { signOut } from 'firebase/auth';

import { auth } from '../../services/firebase';
import { getWatchlist } from '../../services/watchlist';

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState(auth.currentUser);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const currentUser = auth.currentUser;

      setUser(currentUser);

      const loadProfile = async () => {
        if (!currentUser) {
          setWatchlistCount(0);
          setLoading(false);
          return;
        }

        try {
          const movies = await getWatchlist(currentUser.uid);
          setWatchlistCount(movies.length);
        } catch (error) {
          console.log('Profile Error:', error);
          Alert.alert(
            'Error',
            'Unable to load your profile information.'
          );
        } finally {
          setLoading(false);
        }
      };

      loadProfile();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Unable to log out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const displayName = user?.displayName || 'Movie Lover';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>My Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials || 'M'}
          </Text>
        </View>

        <Text style={styles.name}>{displayName}</Text>

        <Text style={styles.email}>
          {user?.email || 'No email available'}
        </Text>

        <Text style={styles.memberText}>
          🎬 Movie Discovery Member
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your Activity</Text>

      <View style={styles.statsCard}>
        <Text style={styles.statNumber}>
          {loading ? '...' : watchlistCount}
        </Text>

        <Text style={styles.statLabel}>
          Movies in your Watchlist
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Account Information</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>
            {displayName}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>
            {user?.email || 'Not available'}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account</Text>
          <Text style={styles.infoValue}>Active</Text>
        </View>
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          ↪  Log Out
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        Movie Discovery App
      </Text>

      <Text style={styles.version}>
        Your next favourite movie awaits.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  content: {
    padding: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  profileCard: {
    backgroundColor: '#202020',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
  },
  email: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 7,
  },
  memberText: {
    color: '#C084FC',
    marginTop: 15,
    fontSize: 14,
  },
  sectionTitle: {
    color: '#A855F7',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  statsCard: {
    backgroundColor: '#202020',
    borderRadius: 15,
    padding: 22,
    alignItems: 'center',
    marginBottom: 28,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: '#202020',
    borderRadius: 15,
    padding: 18,
    marginBottom: 28,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
  },
  logoutButton: {
    backgroundColor: '#9333EA',
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  footer: {
    color: '#A855F7',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
  version: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 7,
  },
});

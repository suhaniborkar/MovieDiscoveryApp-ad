
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
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
              Alert.alert(
                'Error',
                'Unable to log out. Please try again.'
              );
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
      <Text style={styles.topLabel}>THE POPCORN PROJECT</Text>
      <Text style={styles.heading}>My Profile</Text>
      <Text style={styles.subtitle}>
        Your movie journey, all in one place.
      </Text>

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

        <View style={styles.memberBadge}>
          <Text style={styles.memberText}>
            🎬  Movie Lover
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>YOUR ACTIVITY</Text>

      <View style={styles.statsCard}>
        <View style={styles.statIcon}>
          <Text style={styles.statEmoji}>🍿</Text>
        </View>

        <View style={styles.statInfo}>
          <Text style={styles.statNumber}>
            {loading ? '...' : watchlistCount}
          </Text>
          <Text style={styles.statLabel}>
            Movies in your Watchlist
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>

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
          <Text style={styles.infoLabel}>Account status</Text>
          <Text style={styles.activeValue}>● Active</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          ↪  Log Out
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        THE POPCORN PROJECT
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
    paddingBottom: 45,
  },
  topLabel: {
    color: '#8B1500',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 9,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#A3A3A3',
    fontSize: 14,
    marginTop: 7,
    marginBottom: 27,
  },
  profileCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 27,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#303030',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#8B1500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 17,
    borderWidth: 3,
    borderColor: '#A83220',
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
    color: '#A3A3A3',
    fontSize: 14,
    marginTop: 7,
  },
  memberBadge: {
    backgroundColor: '#35150F',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 17,
  },
  memberText: {
    color: '#E5A092',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#B83A27',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.3,
    marginBottom: 14,
  },
  statsCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 21,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#303030',
  },
  statIcon: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#35150F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 17,
  },
  statEmoji: {
    fontSize: 27,
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#A3A3A3',
    fontSize: 13,
    marginTop: 3,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingHorizontal: 18,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#303030',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 17,
  },
  infoLabel: {
    color: '#A3A3A3',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  activeValue: {
    color: '#65C98B',
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
  },
  logoutButton: {
    backgroundColor: '#8B1500',
    padding: 17,
    borderRadius: 13,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    color: '#8B1500',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  version: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});

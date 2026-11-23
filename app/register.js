
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../services/firebase';
import { useRouter, Link } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      Alert.alert('Success', 'Your account has been created!');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo and Branding */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.appName}>THE POPCORN PROJECT</Text>

          <View style={styles.redLine} />

          <Text style={styles.tagline}>
            Discover your next favourite movie.
          </Text>
        </View>

        {/* Registration Form */}
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Create Account</Text>

          <Text style={styles.subtitle}>
            Join us and start exploring!
          </Text>

          <Text style={styles.label}>Full Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email Address</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Create a password (min. 6 characters)"
            placeholderTextColor="#777"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>
                CREATE ACCOUNT
              </Text>
            )}
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
            </Text>

            <Link href="/login" style={styles.loginLink}>
              Login
            </Link>
          </View>
        </View>

        <Text style={styles.footer}>
          DISCOVER. WATCH. REPEAT.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 35,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    width: 110,
    height: 110,
    marginBottom: 15,
  },

  appName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  redLine: {
    width: 55,
    height: 4,
    backgroundColor: '#8B1500',
    borderRadius: 5,
    marginTop: 12,
    marginBottom: 12,
  },

  tagline: {
    color: '#A3A3A3',
    fontSize: 13,
  },

  formContainer: {
    backgroundColor: '#1E1E1E',
    padding: 25,
    borderRadius: 18,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    color: '#A3A3A3',
    fontSize: 13,
    marginBottom: 25,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 9,
  },

  input: {
    backgroundColor: '#292929',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#383838',
  },

  registerButton: {
    backgroundColor: '#8B1500',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    flexWrap: 'wrap',
  },

  loginText: {
    color: '#A3A3A3',
    fontSize: 13,
  },

  loginLink: {
    color: '#E04B35',
    fontSize: 13,
    fontWeight: 'bold',
  },

  footer: {
    color: '#666666',
    fontSize: 11,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 30,
  },
});

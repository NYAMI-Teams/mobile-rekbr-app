import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert, // Using Alert for demonstration purposes as per React Native common practice.
} from 'react-native';

// Main App component that renders the LoginScreen
export default function Login() {
  const handleLogin = (email, password) => {
    // In a real application, you would send these credentials to an authentication API.
    console.log('Attempting to log in with:', { email, password });
    if (email === 'user@example.com' && password === 'password123') {
      Alert.alert('Login Successful', 'Welcome!');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <LoginScreen onLogin={handleLogin} />
    </View>
  );
}

// LoginScreen component definition
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handles the login button press
  const handleLoginPress = () => {
    setError(''); // Clear previous errors

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    // Call the passed onLogin function with the current email and password
    onLogin(email, password);
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Login</Text>

      {/* Email Input Field */}
      <TextInput
        style={loginStyles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input Field */}
      <TextInput
        style={loginStyles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Error Message Display */}
      {error ? <Text style={loginStyles.errorText}>{error}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity style={loginStyles.button} onPress={handleLoginPress}>
        <Text style={loginStyles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Optional: Forgot Password Link */}
      <TouchableOpacity style={loginStyles.forgotPasswordButton}>
        <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Optional: Sign Up Link */}
      <View style={loginStyles.signUpContainer}>
        <Text style={loginStyles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={loginStyles.signUpLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main App container styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5', // Light background color for the overall app
  },
});

// Styles for the LoginScreen component
const loginStyles = StyleSheet.create({
  container: {
    width: '90%', // Adjust width for responsiveness
    maxWidth: 400, // Max width for larger screens
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8, // Android shadow
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 28,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff', // Primary blue color
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545', // Red for error messages
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 15,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  signUpText: {
    color: '#666',
    fontSize: 15,
  },
  signUpLink: {
    color: '#007bff',
    fontSize: 15,
    fontWeight: '600',
  },
});

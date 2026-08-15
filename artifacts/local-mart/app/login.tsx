import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Field, PrimaryButton, Screen, Pill } from '@/components/ui';
import { Role, useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function LoginScreen() {
  const colors = useColors();
  const { login, register } = useApp();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('customer');

  const handleAction = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Incomplete details', 'Please enter your email and password.');
      return;
    }

    if (isRegistering) {
      if (!name.trim()) {
        Alert.alert('Incomplete details', 'Please enter your full name to register.');
        return;
      }
      try {
        const newUser = await register(name, email, password, selectedRole);
        Alert.alert('Account created!', `Your account as ${selectedRole} was created successfully. Please sign in to continue.`, [
          {
            text: 'Sign In Now',
            onPress: () => {
              setIsRegistering(false);
              setPassword(''); // clear password for safety
            }
          }
        ]);
      } catch (err: any) {
        Alert.alert('Registration failed', err.message || 'Unable to register. Try again.');
      }
    } else {
      const success = await login(email, password);
      if (success) {
        // Redirect based on role
        if (email.toLowerCase() === 'admin@email.com') router.replace('/admin');
        else if (email.toLowerCase() === 'owner@email.com') router.replace('/owner');
        else router.replace('/(tabs)');
      } else {
        Alert.alert('Login failed', 'Invalid email or password. Try quick-login buttons below.');
      }
    }
  };

  const quickLogin = (type: 'customer' | 'owner' | 'admin') => {
    if (type === 'customer') {
      setEmail('ananya@email.com');
      setPassword('password');
      setIsRegistering(false);
    } else if (type === 'owner') {
      setEmail('owner@email.com');
      setPassword('owner123');
      setIsRegistering(false);
    } else if (type === 'admin') {
      setEmail('admin@email.com');
      setPassword('admin123');
      setIsRegistering(false);
    }
  };

  return (
    <Screen scroll={true}>
      <View style={styles.container}>
        {/* App Logo/Header */}
        <View style={styles.header}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
            <Feather name="shopping-bag" size={28} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>LocalMart</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Your neighborhood marketplace
          </Text>
        </View>

        {/* Tab switch */}
        <View style={[styles.tabContainer, { backgroundColor: colors.secondary }]}>
          <Pressable
            onPress={() => setIsRegistering(false)}
            style={[
              styles.tab,
              !isRegistering && { backgroundColor: colors.card }
            ]}
          >
            <Text style={[styles.tabText, { color: colors.foreground }, !isRegistering && styles.tabTextActive]}>
              Sign In
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIsRegistering(true)}
            style={[
              styles.tab,
              isRegistering && { backgroundColor: colors.card }
            ]}
          >
            <Text style={[styles.tabText, { color: colors.foreground }, isRegistering && styles.tabTextActive]}>
              Register
            </Text>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {isRegistering && (
            <Field
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          )}

          <Field
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="name@email.com"
            keyboardType="default"
          />

          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />

          {isRegistering && (
            <View style={styles.roleSelection}>
              <Text style={[styles.roleLabel, { color: colors.mutedForeground }]}>Join LocalMart as a:</Text>
              <View style={styles.roleOptions}>
                {(['customer', 'owner', 'admin'] as Role[]).map((r) => {
                  const isActive = selectedRole === r;
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setSelectedRole(r)}
                      style={[
                        styles.roleOption,
                        { borderColor: colors.border },
                        isActive && { backgroundColor: colors.primary, borderColor: colors.primary }
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          { color: isActive ? colors.primaryForeground : colors.foreground }
                        ]}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          <PrimaryButton
            title={isRegistering ? 'Create Account' : 'Sign In'}
            onPress={handleAction}
            icon="arrow-right"
          />
        </View>

        {/* Demo Fast Login */}
        <View style={[styles.demoSection, { borderColor: colors.border }]}>
          <Text style={[styles.demoTitle, { color: colors.mutedForeground }]}>
            Quick access for testing
          </Text>
          <View style={styles.demoButtons}>
            <Pressable
              onPress={() => quickLogin('customer')}
              style={[styles.demoButton, { backgroundColor: colors.secondary }]}
            >
              <Feather name="user" size={14} color={colors.primary} />
              <Text style={[styles.demoButtonText, { color: colors.foreground }]}>Customer</Text>
            </Pressable>
            <Pressable
              onPress={() => quickLogin('owner')}
              style={[styles.demoButton, { backgroundColor: colors.secondary }]}
            >
              <Feather name="store" size={14} color={colors.primary} />
              <Text style={[styles.demoButtonText, { color: colors.foreground }]}>Mart Owner</Text>
            </Pressable>
            <Pressable
              onPress={() => quickLogin('admin')}
              style={[styles.demoButton, { backgroundColor: colors.secondary }]}
            >
              <Feather name="shield" size={14} color={colors.primary} />
              <Text style={[styles.demoButtonText, { color: colors.foreground }]}>Platform Admin</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    opacity: 0.8,
  },
  tabTextActive: {
    fontFamily: 'Inter_700Bold',
    opacity: 1,
  },
  form: {
    gap: 15,
  },
  roleSelection: {
    marginBottom: 10,
  },
  roleLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },
  roleOptionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  demoSection: {
    marginTop: 40,
    borderTopWidth: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  demoTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  demoButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
});

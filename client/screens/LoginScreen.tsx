import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginWithSSO } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSSOLoading, setIsSSOLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    
    if (!success) {
      Alert.alert("Login Failed", "Invalid credentials. Please try again.");
    }
  };

  const handleSSOLogin = async () => {
    setIsSSOLoading(true);
    const success = await loginWithSSO();
    setIsSSOLoading(false);
    
    if (!success) {
      Alert.alert("SSO Failed", "Unable to authenticate with SSO. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing["4xl"],
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.appTitle}>Mobile GRN</ThemedText>
          <ThemedText style={styles.appSubtitle}>
            SAP S/4HANA Goods Receipt
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <Pressable
            style={[styles.ssoButton, isSSOLoading && styles.buttonDisabled]}
            onPress={handleSSOLogin}
            disabled={isSSOLoading || isLoading}
          >
            {isSSOLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name="shield" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <ThemedText style={styles.ssoButtonText}>
                  Sign in with SSO
                </ThemedText>
              </>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>or</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={20}
              color={Colors.light.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Colors.light.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={20}
              color={Colors.light.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.light.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={Colors.light.textSecondary}
              />
            </Pressable>
          </View>

          <Pressable
            style={styles.rememberContainer}
            onPress={() => setRememberDevice(!rememberDevice)}
          >
            <View
              style={[
                styles.checkbox,
                rememberDevice && styles.checkboxChecked,
              ]}
            >
              {rememberDevice ? (
                <Feather name="check" size={14} color="#FFFFFF" />
              ) : null}
            </View>
            <ThemedText style={styles.rememberText}>
              Remember this device
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading || isSSOLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.securityText}>
            Secure enterprise authentication
          </ThemedText>
          <View style={styles.footerLinks}>
            <Pressable>
              <ThemedText style={styles.footerLink}>Privacy Policy</ThemedText>
            </Pressable>
            <ThemedText style={styles.footerDot}>|</ThemedText>
            <Pressable>
              <ThemedText style={styles.footerLink}>Terms of Service</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing["2xl"],
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing["4xl"],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
    borderRadius: 16,
  },
  appTitle: {
    ...Typography.h1,
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  appSubtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
  },
  ssoButton: {
    backgroundColor: Colors.light.primary,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  ssoButtonText: {
    ...Typography.button,
    color: "#FFFFFF",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    paddingHorizontal: Spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.inputBackground,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.xs,
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    ...Typography.input,
    color: Colors.light.text,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginRight: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  rememberText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    ...Typography.button,
    color: "#FFFFFF",
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing["3xl"],
  },
  securityText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLink: {
    ...Typography.caption,
    color: Colors.light.primary,
  },
  footerDot: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginHorizontal: Spacing.sm,
  },
});

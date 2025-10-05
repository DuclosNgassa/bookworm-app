import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import styles from "../../assets/styles/login.styles.js"
import COLORS from '@/constants/colors.js';
import { Link } from 'expo-router';
import { useAuthStore } from '@/store/authStore.js';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {login, isLoading, isCheckingAuth} = useAuthStore();

    const handleLogin = async () => { 
        const result = await login(email, password)
        
        console.log("Result login: ", JSON.stringify(result));
        if(!result.success){
            Alert.alert("Error", result.success);
        }
    };
    
    if(isCheckingAuth){
        return null;
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image source={require("../../assets/images/i.png")}
                        style={styles.illustrationImage}
                        resizeMode='contain' />
                </View>
                <View style={styles.card}>
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name='mail-outline'
                                    size={28}
                                    color={COLORS.primary}
                                    style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder='Enter your email'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name='lock-closed-outline'
                                    size={28}
                                    color={COLORS.primary}
                                    style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder='Enter your password'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    autoCapitalize='none'
                                    secureTextEntry={!showPassword}

                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        style={styles.inputIcon}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color={'#fff'} />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don´t have an account?</Text>
                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.link}>Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login
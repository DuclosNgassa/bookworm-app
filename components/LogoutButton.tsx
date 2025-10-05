import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store/authStore'
import styles from '@/assets/styles/profile.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '@/constants/colors'

const LogoutButton = () => {
    const { logout } = useAuthStore();

    const confirmLogout = async () => {
        try {
            Alert.alert(
                "Logout",
                "Are you sure you want to logout?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Logout", style: 'destructive', onPress: () => logout() },
                ]
            )
        } catch (error) {
            console.log("Error while login out", error);
            Alert.alert("Error", "Something went wrong");
        }
    }

    return (
        <TouchableOpacity
            style={styles.logoutButton}
            onPress={confirmLogout}
        >
            <Ionicons name='log-out-outline' size={20} color={COLORS.white} />
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    )
}

export default LogoutButton
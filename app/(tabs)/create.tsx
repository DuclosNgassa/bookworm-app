import { View, Text, KeyboardAvoidingView, ScrollView, Platform, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import styles from '../../assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { File } from 'expo-file-system/next';

import API_URL from '../../constants/api.js'
import { useAuthStore } from '@/store/authStore';

const Create = () => {
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [rating, setRating] = useState(3);
    const [image, setImage] = useState("");
    const [imageBase64, setImageBase64] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const { token } = useAuthStore();

    const pickImage = async () => {
        try {
            // request permission if needed
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert("Permission denied", "We need camera role permission to upload an image");
                    return;
                }
            }
            // launch image library
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5, // lower quality for smaller base64
                base64: true,
            })

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                if (result.assets[0].base64) {
                    setImageBase64(result.assets[0].base64)
                } else {
                    const file = new File(result.assets[0].uri);
                    const base64 = await file.base64();
                    setImageBase64(base64);
                }
            }
        } catch (error) {
            console.log("Error picking image", error);
            Alert.alert("Error", "There was a problem selecting your image");
        }
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            // get file extension from URI  or default to jpeg
            const uriParts = image.split(".");
            const fileType = uriParts[uriParts.length - 1];
            const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

            const imageDataUri = `data:${imageType};base64,${imageBase64}`;

            console.log("API_URL: ", API_URL);
            
            const response = await fetch(`${API_URL}/books`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    caption,
                    rating: rating.toString(),
                    image: imageDataUri
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong")
            }
            Alert.alert("Success", "Your book recommandation has been  posted!");
            setTitle("");
            setCaption("");
            setRating(3);
            setImage("");
            setImageBase64("");
            router.push("/");
        } catch (error) {
            console.log("Error creating a post", error);
            Alert.alert("Error", "Something  went wrong");
        } finally{
            setIsLoading(false);
        }
    }

    const renderRatingPicker = () => {
        const starts = [];
        for (let i = 1; i <= 5; i++) {
            starts.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => setRating(i)}
                    style={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? 'star' : 'star-outline'}
                        size={32}
                        color={i <= rating ? '#f4b400' : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            )
        }

        return <View style={styles.ratingContainer}>{starts}</View>
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Book recommendation</Text>
                        <Text style={styles.subtitle}>Share your favorite reads with others</Text>
                    </View>
                    <View style={styles.form}>
                        {/* BOOK TITLE */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book title</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name='book-outline'
                                    size={20}
                                    color={COLORS.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder='Enter book title'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>

                        {/* RATING */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Your Rating</Text>
                            {renderRatingPicker()}
                        </View>

                        {/* IMAGE */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book image</Text>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.previewImage} />
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <Ionicons name='image-outline' size={40} color={COLORS.textSecondary} />
                                        <Text style={styles.placeholderText}>Tap to select an image</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                        {/* Caption */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Caption</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder='Write your review or thoughts about this book...'
                                placeholderTextColor={COLORS.placeholderText}
                                value={caption}
                                onChangeText={setCaption}
                                multiline
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Ionicons
                                        name='cloud-upload-outline'
                                        size={20}
                                        color={COLORS.white}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.buttonText}>Share</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Create
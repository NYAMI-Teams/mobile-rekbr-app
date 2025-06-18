import * as SecureStore from 'expo-secure-store';

const TOKEY_KEY = 'auth_token';

export const getAccessToken = async () => {
    try {
        return await SecureStore.getItemAsync(TOKEY_KEY);
    } catch (error) {
        throw new Error("Error getting access token:", error);
    }
}

export const setAccessToken = async (token) => {
    try {
        await SecureStore.setItemAsync(TOKEY_KEY, token);
    } catch (error) {
        throw new Error("Error setting access token:", error);
    }
}

export const removeAccessToken = async () => {
    try {
        await SecureStore.deleteItemAsync(TOKEY_KEY);
    } catch (error) {
        throw new Error("Error removing access token:", error);
    }
}

export const setProfileStore = async (profile) => {
    try {
        await SecureStore.setItemAsync('profile', JSON.stringify(profile));
    } catch (error) {
        throw new Error("Error setting profile store:", error);
    }   
}

export const getProfileStore = async () => {
    try {
        const profile = await SecureStore.getItemAsync('profile');
        return profile ? JSON.parse(profile) : null;
    } catch (error) {
        throw new Error("Error getting profile store:", error);
    }
}
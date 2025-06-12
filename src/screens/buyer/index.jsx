import { StatusBar } from 'expo-status-bar';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import EmptyIllustration from '../../components/Ilustration';

export default function BuyerEmptyContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [isKycCompleted, setIsKycCompleted] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = 'YOUR_ACCESS_TOKEN_HERE';

                const response = await fetch('https://api.rekbr.com/user/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('User profile:', data);
                setIsKycCompleted(data.kycStatus === 'COMPLETED');
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white pt-4 px-6 justify-start">
            <StatusBar style="dark" />

            {/* Content Empty */}
            <View className="items-center mt-8">
                <EmptyIllustration text={"loremipsum"} />

            </View>
        </SafeAreaView>
    );
}

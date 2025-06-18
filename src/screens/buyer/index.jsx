import { StatusBar } from 'expo-status-bar';
import { View, Text, SafeAreaView } from 'react-native';
import EmptyIllustration from '../../components/Ilustration';

export default function BuyerEmptyContent() {
    return (
        <SafeAreaView className="flex-1 bg-white pt-4 justify-start">
            <StatusBar style="dark" />

            {/* Content Empty */}
            <View className="items-center mt-8">
                <EmptyIllustration text={`Belum ada Rekber yang masuk.\nTunggu seller kirimkan Rekber untuk kamu`} />
            </View>
        </SafeAreaView>
    );
}

import { Image, Text } from 'react-native';

export default function EmptyIllustration({text}) {
    return (
        <>
        <Image
            source={require('../../assets/illustration-empty.png')}
            className="w-72 h-72 mb-4"
            resizeMode="contain"
        />
        <Text className="text-sm text-gray-600 font-normal text-center">{text}</Text>
        </>
    );
}
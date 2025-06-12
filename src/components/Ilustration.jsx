import { Image } from 'react-native';

export default function EmptyIllustration() {
    return (
        <Image
            source={require('../../assets/illustration-empty.png')}
            className="w-72 h-72 mb-4"
            resizeMode="contain"
        />
    );
}
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef } from "react";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "slide1",
    image: require("../../assets/illustration-pay.png"),
    text: "Bayar Setelah Pasti, Tanpa Drama.\nKeamananmu, Prioritas Kami!",
  },
  {
    key: "slide2",
    image: require("../../assets/illustration-belanja.png"),
    text: "Belanja Aman, Jual Tanpa Khawatir.\nKepercayaan Ada di Setiap Transaksi.",
  },
  {
    key: "slide3",
    image: require("../../assets/illustration-handshake.png"),
    text: "Pembeli Puas, Penjual Senang.\nTransaksi Lancar, Tanpa Kekhawatiran.",
  },
];

export default function Landing() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo-rekbr.png")}
            style={styles.logoRekbr}
            resizeMode="contain"
          />
        </View>

        <View style={styles.slidesWrapper}>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            contentContainerStyle={styles.slidesContainer}>
            {slides.map((slide, index) => (
              <View style={styles.slide} key={slide.key}>
                <Image
                  source={slide.image}
                  style={styles.illustration}
                  resizeMode="contain"
                />
                <Text style={styles.slogan}>{slide.text}</Text>
              </View>
            ))}
          </Animated.ScrollView>

          <View style={styles.dotsContainer}>
            {slides.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

              const dotScale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1.2, 0.8],
                extrapolate: "clamp",
              });

              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      transform: [{ scale: dotScale }],
                      opacity: dotOpacity,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // TODO: Implement registration navigation
              router.replace("/auth/register");
            }}>
            <Text style={styles.buttonText}>Registrasi Sekarang</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity
              onPress={() => {
                router.replace("/auth/login");
              }}>
              <Text style={styles.loginLink}>Silakan Masuk</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Image
              source={require("../../assets/logo-powered.png")}
              style={styles.footerLogo}
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  logoRekbr: {
    width: 120,
    height: 48,
  },
  slidesWrapper: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  slidesContainer: {
    alignItems: "center",
  },
  slide: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  illustration: {
    width: width * 0.9, // lebar hampir full screen
    height: width * 0.9, // tinggi mengikuti lebar
    flexShrink: 0,
    marginBottom: 24, // supaya dots tetap di bawah
  },
  slogan: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24, // kasih margin bawah biar dots ga nabrak
  },
  dotsContainer: {
    position: "absolute",
    bottom: 40, // dots lebih ke bawah aman
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    marginHorizontal: 5,
  },
  bottomSection: {
    paddingBottom: 16,
  },
  button: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    color: "#444",
  },
  loginLink: {
    fontSize: 14,
    color: "#2F68CC",
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerLogo: {
    width: 150,
    height: 30,
  },
});

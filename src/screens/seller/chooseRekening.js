import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  Animated,
  UIManager,
  LayoutAnimation,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const initialFavorites = [];

const initialSaved = [
  {
    id: '1',
    name: 'Bayu',
    bank: 'Bank Negara Indonesia',
    accountNumber: '0900604501',
    bankLogo: require('../../../assets/logo-bni.png'),
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Zhirazzi',
    bank: 'Bank Negara Indonesia',
    accountNumber: '0900604502',
    bankLogo: require('../../../assets/logo-bni.png'),
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Diffa',
    bank: 'Bank Negara Indonesia',
    accountNumber: '0900604503',
    bankLogo: require('../../../assets/logo-bni.png'),
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Reynhard',
    bank: 'Bank Negara Indonesia',
    accountNumber: '0900604504',
    bankLogo: require('../../../assets/logo-bni.png'),
    isFavorite: false,
  },
];

export default function PilihRekeningScreen() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [saved, setSaved] = useState(initialSaved);

  const toggleFavorite = (item, fromFavorites) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (fromFavorites) {
      setFavorites(prev => prev.filter(x => x.id !== item.id));
      setSaved(prev => [{ ...item, isFavorite: false }, ...prev]);
    } else {
      setSaved(prev => prev.filter(x => x.id !== item.id));
      setFavorites(prev => [{ ...item, isFavorite: true }, ...prev]);
    }
  };

  const renderAccountItem = (item, fromFavorites, index = 0) => {
    return (
      <AnimatedAccountItem
        key={item.id}
        item={item}
        fromFavorites={fromFavorites}
        toggleFavorite={toggleFavorite}
        index={index}
      />
    );
  };

  const isEmpty = favorites.length === 0 && saved.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../../../assets/icon-back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Pilih Rekening Kamu</Text>
      </View>

      <View style={styles.topBackground}>
        <Image
          source={require('../../../assets/illustration-transfer.png')}
          style={styles.topImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Cari nama, bank, atau nomor rekening"
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        <Image
          source={require('../../../assets/icon-search.png')}
          style={styles.searchIcon}
        />
      </View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <Image
            source={require('../../../assets/illustration-empty.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>
            Kamu belum pernah transaksi sebelumnya, jadi belum ada tujuan rekening yang bisa dituju.
          </Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
              <Text style={styles.sectionTitle}>Tujuan Favorit kamu!</Text>
              {favorites.length === 0 ? (
                <Text style={styles.noFavoritesText}>
                  Tambah tujuan favorit kamu biar lebih gampang nyarinya nanti, biar nggak ribet!
                </Text>
              ) : (
                favorites.map((item, index) => renderAccountItem(item, true, index))
              )}

              {saved.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                    Tujuan Tersimpan
                  </Text>
                  {saved.map((item, index) => renderAccountItem(item, false, index))}
                </>
              )}
            </View>
          }
          data={[]}
          renderItem={null}
          keyExtractor={() => ''}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>＋ Rekening</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const AnimatedAccountItem = ({ item, fromFavorites, toggleFavorite, index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100), // Staggered animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.accountItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Image source={item.bankLogo} style={styles.bankLogo} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.bankName}>{item.bank}</Text>
          <Text style={styles.accountNumber}>{item.accountNumber}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item, fromFavorites)}>
        <Image
          source={
            item.isFavorite
              ? require('../../../assets/icon-star-filled.png')
              : require('../../../assets/icon-star-outline.png')
          }
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
  },
  topBackground: {
    backgroundColor: '#EAFBF8',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    minHeight: screenHeight * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
  },
  topImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: -screenHeight * 0.035,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  noFavoritesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAFBF8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bankLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  accountName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  bankName: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
  accountNumber: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

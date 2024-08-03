import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { auth, db } from "../config/FirebaseConfig";
import * as Location from "expo-location";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons'

const SearchScreen = ({ navigation, route }) => {
  const { userID, userEmail, userData } = route.params;

  const [location, setLocation] = useState(null);
  const [listings, setListings] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const mapRef = useRef(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [city, setCity] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    getCurrLocation();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [city])

  useEffect(() => {
    if (listings.length > 0 && mapRef.current) {
      const markerCoordinates = listings.map((listing) => ({
        latitude: listing.latitude,
        longitude: listing.longitude,
      }));
      mapRef.current.fitToCoordinates(markerCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [listings]);

  const requestLocationPermission = async () => {
    try {
      const permissionObject = await Location.requestForegroundPermissionsAsync();
      if (permissionObject.status === "granted") {
        console.log("Location permission granted");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.log(`Error while requesting location permission: ${err}`);
    }
  };

  const getCurrLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      if (currentLocation) {
        console.log(`Current location: ${JSON.stringify(currentLocation)}`);
        setLocation(currentLocation);
        const mapRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        };
        setMapRegion(mapRegion);

        // Get city name using reverse geocoding
        const [address] = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        if (address && address.city) {
          setCity(address.city); // Set the city state
          console.log(`Current city: ${address.city}`);
        }

        if (mapRef.current) {
          mapRef.current.animateToRegion(mapRegion, 1000);
          console.log("Map animated");
        } else {
          console.log("MapView is null. Cannot show the location on map");
        }
      } else {
        console.log("Could not obtain the current device location");
      }
    } catch (error) {
      console.log(`Error while accessing device location: ${error}`);
    }
  };

  const fetchListings = async () => {
    try {
      const collectionRef = collection(db, "owners_listings");
      const cityQuery = query(collectionRef, where("city", "==", city))
      const unsubscribe = onSnapshot(cityQuery, (querySnapshot) => {
        const resultsFromDB = [];
        querySnapshot.forEach((eachDoc) => {
          console.log(`eachDoc: ${JSON.stringify(eachDoc.data())}`);
          const fetchedListing = {
            id: eachDoc.id,
            ...eachDoc.data(),
          };
          resultsFromDB.push(fetchedListing);
        });
        setListings(resultsFromDB);
        console.log(`Listings: ${JSON.stringify(resultsFromDB)}`);
      });

      return () => unsubscribe();
    } catch (error) {
      console.log(`Error fetching listings: ${error}`);
    }
  };

  const handleBookNow = async (item) => {
    console.log("handle book now");
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 10));
    const bookingDetails = {
      vehicleId: item.id,
      vehicleName: item.vehicleName,
      image: item.photo,
      renterId: auth.currentUser.uid,
      ownerId: item.userID,
      ownerName: item.ownerName,
      ownerPhoto: item.ownerPhoto,
      renterName: userData.name,
      renterPhoto: userData.photo,
      bookingDate: randomDate.toDateString(),
      bookingStatus: "Needs Approval",
      licensePlate: item.licensePlate,
      pickupLocation: item.pickupLocation,
      rentalPrice: item.rentalPrice,
    };
    const collectionRef = collection(db, "bookings");
    try {
      await addDoc(collectionRef, bookingDetails);
      Alert.alert(
        "Booking Request Sent",
        "Your booking request has been sent. Please wait for approval before the booking can be confirmed.",
        [{ text: "OK", onPress: () => setModalVisible(false) }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "There was an error processing your booking. Please try again."
      );
    }
  };

  const handleMarkerPress = (listing) => {
    setSelectedListing(listing);
    setModalVisible(true);
  };

  if (!location || !mapRegion) {
    return <Text>Loading...</Text>;
  }

  const CustomMarker = ({ price }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.customMarker}>
        <Text style={styles.markerText}>${price}</Text>
      </View>
      <Ionicons name="chevron-down-outline" size={20} color={"#2d9cdb"} />
    </View>
  );

  const ListingModal = ({ listing, visible, onClose }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image source={{ uri: listing.photo }} style={styles.modalImage} />
          <Text style={styles.modalTitle}>{listing.vehicleName}</Text>

          <View style={styles.modalTextContainer}>
            <Text style={styles.priceText}>Price: ${listing.rentalPrice}/week</Text>
            <Text style={styles.horsepowerText}>Horsepower: {listing.horsepower}</Text>
            <Text style={styles.seatingCapacityText}>Seating Capacity: {listing.seatingCapacity}</Text>
            <Text style={styles.pickupLocationText}>Pickup Location: {listing.pickupLocation}</Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => handleBookNow(listing)}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        //region={mapRegion}
        initialRegion={mapRegion}
      // showsUserLocation={true}
      >
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={{
              latitude: listing.latitude,
              longitude: listing.longitude,
            }}
            onPress={() => handleMarkerPress(listing)}
          >
            <CustomMarker price={listing.rentalPrice} />
          </Marker>
        ))}
      </MapView>
      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    backgroundColor: "#ffffffe6",
    padding: 8,
    borderRadius: 5,
    borderColor: "#2d9cdb",
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerText: {
    fontWeight: "bold",
    color: "#2d9cdb"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "#00000080"
  },
  modalView: {
    width: Dimensions.get("window").width * 0.8,
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2D9CDB",
  },
  modalTextContainer: {
    width: '100%',
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
  priceText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2D9CDB",
  },
  horsepowerText: {
    fontSize: 16,
    color: "#555",
  },
  seatingCapacityText: {
    fontSize: 16,
    color: "#555",
  },
  pickupLocationText: {
    fontSize: 16,
    color: "#555",
  },
  bookButton: {
    backgroundColor: "#2D9CDB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    elevation: 2,
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
  },
  closeButtonText: {
    color: "#2D9CDB",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});

export default SearchScreen;

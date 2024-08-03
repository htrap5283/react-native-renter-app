import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../config/FirebaseConfig";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";

const ReservationsScreen = ({ route }) => {
  const { userID, userEmail, userData } = route.params;
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const bookingsCollection = collection(db, 'bookings');
    const userQuery = query(bookingsCollection, where("renterId", "==", userID))
    const unsubscribe = onSnapshot(userQuery, (snapshot) => {
      const bookingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(bookingList);
    });
    return () => unsubscribe();
  };

  const ReservationCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.vehicleImage} />
      <View style={styles.cardContent}>
        <Text style={styles.vehicleName}>{item.vehicleName}</Text>
        <Text>Booking Date: {item.bookingDate}</Text>
        <Text>License Plate: {item.licensePlate}</Text>
        <Text>Pickup Location: {item.pickupLocation}</Text>
        <Text>Price: ${item.rentalPrice}/day</Text>
        <View style={styles.ownerInfo}>
          <Image source={{ uri: item.ownerPhoto }} style={styles.ownerPhoto} />
          <Text style={styles.ownerName}>{item.ownerName}</Text>
        </View>
        <Text style={styles.status}>Status: {item.bookingStatus}</Text>
        {item.bookingStatus === "Approved" && (
          <Text style={styles.confirmationCode}>
            Confirmation Code: {item.confirmationCode}
          </Text>
        )}
        {item.bookingStatus === "Declined" && (
          <Text style={styles.declinedText}>
            Booking is declined
          </Text>
        )}
        {item.bookingStatus === "Needs Approval" && (
          <Text style={styles.pendingText}>
            Booking request pending
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <>{
      (reservations.length === 0) ?
        <View style={styles.emptyView}>
          <Text style={styles.emptyTitle}>No reservations found</Text>
        </View> :
        <FlatList
          data={reservations}
          renderItem={({ item }) => <ReservationCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.container}
        />
    }</>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  ownerPhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  ownerName: {
    fontWeight: "bold",
  },
  status: {
    fontWeight: "bold",
    marginTop: 8,
  },
  confirmationCode: {
    marginTop: 8,
    color: "green",
    fontWeight: "bold",
  },
  declinedText: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold",
  },
  pendingText: {
    marginTop: 8,
    color: "orange",
    fontWeight: "bold",
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
});

export default ReservationsScreen;
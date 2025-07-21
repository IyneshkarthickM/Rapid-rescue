
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { ref, onValue, set } from "firebase/database";
import { firestore, database } from "./firebase"; // Correct import
import { doc, setDoc } from "firebase/firestore";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const libraries = ["places"];

const MapComponent = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCv8NpytKteXp6_c3kME9sc7WJpKslNZ8k", 
    libraries,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [ambulanceList, setAmbulanceList] = useState([]);
  const [nearbyAmbulances, setNearbyAmbulances] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [directions, setDirections] = useState(null);

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const savedLat = localStorage.getItem("userLatitude");
    const savedLng = localStorage.getItem("userLongitude");
    if (savedLat && savedLng) {
      setUserLocation({ lat: parseFloat(savedLat), lng: parseFloat(savedLng) });
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setUserLocation(newLoc);

        localStorage.setItem("userLatitude", latitude);
        localStorage.setItem("userLongitude", longitude);

        const userDocRef = doc(firestore, "users", "currentUser"); 
        console.log(userDocRef);  // Corrected here
        setDoc(userDocRef, {
          latitude,
          longitude,
          timestamp: Date.now(),
        }).catch(console.error);
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const driversRef = ref(database, "drivers");
    const unsubscribe = onValue(driversRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const drivers = Object.keys(data).map((key) => ({
          id: key,
          firstName: data[key]?.firstName || "Unknown",
          contactNumber: data[key]?.contactNumber || "N/A",
          lat: data[key]?.location?.latitude,
          lng: data[key]?.location?.longitude,
        })).filter((item) => item.lat && item.lng);

        setAmbulanceList(drivers);
      }
    }, console.error);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userLocation && ambulanceList.length > 0) {
      const sortedDrivers = ambulanceList.map((driver) => ({
        ...driver,
        distance: getDistanceInKm(
          userLocation.lat,
          userLocation.lng,
          driver.lat,
          driver.lng
        ),
      })).sort((a, b) => a.distance - b.distance);

      setNearbyAmbulances(sortedDrivers.slice(0, 5));
    }
  }, [userLocation, ambulanceList]);

  const handleBookAmbulance = (driver) => {
    setSelectedDriver(driver);

    const requestRef = ref(database, `requests/${driver.id}`);
    set(requestRef, {
      userLatitude: userLocation?.lat,
      userLongitude: userLocation?.lng,
      requestedAt: Date.now(),
    }).catch(console.error);

    alert(`Booking request sent to ${driver.firstName} ✅`);

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: driver.lat, lng: driver.lng },
        destination: userLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", result);
        }
      }
    );
  };

  const handleCallDriver = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (loadError) return <p>❌ Error loading Maps</p>;
  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || { lat: 20.5937, lng: 78.9629 }}
        zoom={userLocation ? 14 : 5}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            title="You"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}

        {nearbyAmbulances.map((driver) => (
          <Marker
            key={driver.id}
            position={{ lat: driver.lat, lng: driver.lng }}
            title={`${driver.firstName} 📞 ${driver.contactNumber}`}
            onClick={() => setSelectedDriver(driver)}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        ))}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <div style={{
        backgroundColor: "#fff",
        padding: "20px",
        marginTop: "10px",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}>
        <h3>Nearby Ambulances</h3>

        {nearbyAmbulances.map((driver) => (
          <div key={driver.id} style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px",
          }}>
            <h4>{driver.firstName}</h4>
            <p>📞 {driver.contactNumber}</p>
            <p>📍 {driver.distance.toFixed(2)} km away</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleCallDriver(driver.contactNumber)} style={{
                padding: "8px 12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}>
                Call
              </button>
              <button onClick={() => handleBookAmbulance(driver)} style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}>
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MapComponent;



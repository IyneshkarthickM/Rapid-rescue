
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { ref, onValue, get } from "firebase/database";
import { firestore, database, auth } from "./firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const libraries = ["places"];

const MapforAmbulance = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCv8NpytKteXp6_c3kME9sc7WJpKslNZ8k",
    libraries,
  });

  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocations, setUserLocations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [directions, setDirections] = useState(null);
  const [requests, setRequests] = useState([]);
  const [currentDriver, setCurrentDriver] = useState(null);

  useEffect(() => {
    const fetchCurrentDriver = async () => {
      if (auth.currentUser) {
        const driverId = auth.currentUser.uid;
        const driverRef = ref(database, `drivers/${driverId}`);
        
        // Get driver details once to set initial state
        get(driverRef).then((snapshot) => {
          if (snapshot.exists()) {
            const driverData = snapshot.val();
            setCurrentDriver({
              id: driverId,
              firstName: driverData.firstName || "Unknown",
              contactNumber: driverData.contactNumber || "N/A",
            });

            // Set driver location if available
            if (driverData.location) {
              setDriverLocation({
                lat: driverData.location.latitude,
                lng: driverData.location.longitude
              });
            }
          }
        }).catch(console.error);

        // Listen for location updates
        return onValue(driverRef, (snapshot) => {
          if (snapshot.exists()) {
            const driverData = snapshot.val();
            if (driverData.location) {
              setDriverLocation({
                lat: driverData.location.latitude,
                lng: driverData.location.longitude
              });
            }
          }
        });
      }
    };

    const unsubscribe = fetchCurrentDriver();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Watch for driver's current location and update in database
  useEffect(() => {
    if (!auth.currentUser) return;
    
    const driverId = auth.currentUser.uid;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setDriverLocation(newLoc);

        // Update driver location in database
        const driverLocationRef = ref(database, `drivers/${driverId}/location`);
        const locationData = {
          latitude,
          longitude,
          timestamp: Date.now(),
        };
        
        // Using set from firebase/database (you would need to import this)
        import("firebase/database").then(({ set }) => {
          set(driverLocationRef, locationData).catch(console.error);
        });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Listen for user requests from Realtime Database
  useEffect(() => {
    if (!auth.currentUser) return;
    
    const driverId = auth.currentUser.uid;
    const requestsRef = ref(database, `requests/${driverId}`);
    
    const unsubscribe = onValue(requestsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const requestData = snapshot.val();
        
        // For each request, get user information from Firestore
        if (requestData.userLatitude && requestData.userLongitude) {
          try {
            // You might want to get additional user info from Firestore if needed
            const newRequest = {
              userLatitude: requestData.userLatitude,
              userLongitude: requestData.userLongitude,
              requestedAt: requestData.requestedAt,
              userId: requestData.userId || "unknown"
            };
            
            setRequests([newRequest]);
            
            // Add this user location to userLocations array
            setUserLocations([{
              id: newRequest.userId,
              lat: newRequest.userLatitude,
              lng: newRequest.userLongitude
            }]);
          } catch (error) {
            console.error("Error processing request:", error);
          }
        }
      } else {
        setRequests([]);
      }
    }, console.error);

    return () => unsubscribe();
  }, [driverLocation]);

  // Fetch user locations from Firestore
  useEffect(() => {
    const usersRef = collection(firestore, "users");
    
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.latitude && userData.longitude) {
          users.push({
            id: doc.id,
            lat: userData.latitude,
            lng: userData.longitude,
            timestamp: userData.timestamp
          });
        }
      });
      
      // Combine with any real-time request users
      const existingUserIds = new Set(userLocations.map(u => u.id));
      const newUsers = users.filter(user => !existingUserIds.has(user.id));
      
      if (newUsers.length > 0) {
        setUserLocations(prev => [...prev, ...newUsers]);
      }
    });

    return () => unsubscribe();
  }, [driverLocation]);

  const handleAcceptRequest = (request) => {
    if (!auth.currentUser) return;
    
    const driverId = auth.currentUser.uid;
    
    // Update request status in database
    const requestRef = ref(database, `requests/${driverId}/status`);
    import("firebase/database").then(({ set }) => {
      set(requestRef, "accepted").catch(console.error);
    });
    
    // Get directions to user
    if (driverLocation && request) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverLocation,
          destination: { lat: request.userLatitude, lng: request.userLongitude },
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
    }
  };

  // Handle user selection on map
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    
    if (driverLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverLocation,
          destination: { lat: user.lat, lng: user.lng },
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
    }
  };

  if (loadError) return <p>❌ Error loading Maps</p>;
  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={driverLocation || { lat: 20.5937, lng: 78.9629 }}
        zoom={driverLocation ? 14 : 5}
      >
        {driverLocation && (
          <Marker
            position={driverLocation}
            title="You (Driver)"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}

        {userLocations.map((user) => (
          <Marker
            key={user.id}
            position={{ lat: user.lat, lng: user.lng }}
            title={`User`}
            onClick={() => handleUserSelect(user)}
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
        {currentDriver && (
          <h3>Driver: {currentDriver.firstName}</h3>
        )}

        <h3>Incoming Requests</h3>
        {requests.length > 0 ? (
          requests.map((request, index) => (
            <div key={index} style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}>
              <p>📍 User Location: {request.userLatitude?.toFixed(6)}, {request.userLongitude?.toFixed(6)}</p>
              <p>⏰ Requested at: {new Date(request.requestedAt).toLocaleTimeString()}</p>
              <button onClick={() => handleAcceptRequest(request)} style={{
                padding: "8px 12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px"
              }}>
                Accept Request
              </button>
            </div>
          ))
        ) : (
          <p>No active requests at the moment.</p>
        )}

        <h3>Nearby Users</h3>
        {userLocations.length > 0 ? (
          userLocations.map((user) => (
              <div key={user.id} style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "8px",
              }}>
                <p>User ID: {user.id}</p>
                <p>⏰ Last updated: {user.timestamp ? new Date(user.timestamp).toLocaleTimeString() : "N/A"}</p>
                <button onClick={() => handleUserSelect(user)} style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}>
                  Get Directions
                </button>
              </div>
            ))
        ) : (
          <p>No users found nearby.</p>
        )}
      </div>
    </>
  );
};

export default MapforAmbulance;
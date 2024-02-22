import { useQuery, useMutation } from "react-query";
import { postRegisterUser } from "../api/userApi/userApi";
import { getGymOwners } from "../api/publicApi/publicApi";
import { getUserGyms } from "../api/userApi/privateUserApi";

import Header from "../layout/Header/Header";
import ExploreBox from "../components/ExploreBox/ExploreBox";
import UserSignUpModal from "../components/UserSignUpModal/UserSignUpModal";
import backgroundImage from "../assets/images/gym-sample.jpg";
import { useState, useEffect } from "react";
import TokenService from "../services/token";
import locationMarker from "../assets/images/current-location-marker.png";
import UserJoinOtherGymModal from "../components/UserJoinOtherGymModal/UserJoinOtherGymModal";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  InfoWindowF,
  CircleF,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { Flex, Box, useDisclosure, useToast } from "@chakra-ui/react";

const center = { lat: 6.919008776885199, lng: 122.07734107888048 };

const Explore = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedGym, setSelectedGym] = useState(null);
  const [exploreState, setExploreState] = useState("explore");

  const [location, setLocation] = useState([]);

  const { isLoaded } = useJsApiLoader({
    // googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    googleMapsApiKey: "AIzaSyDrEoMAjf6lO-05iin-Gat1FlMqVHQJ2LU",
  });

  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [directionResponse, setDirectionResponse] = useState(null);

  const {
    isOpen: isUserSignUpOpen,
    onOpen: openUserSignUp,
    onClose: closeUserSignUp,
  } = useDisclosure();
  const {
    isOpen: isUserJoinGymOpen,
    onOpen: openUserJoinGym,
    onClose: closeUserJoinGym,
  } = useDisclosure();

  const { data, isLoading } = useQuery(
    "gymOwners",
    async () => {
      return TokenService.getUserLocal() ? getUserGyms() : getGymOwners();
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
      onSuccess: (result) => {
        let approvedGym = result?.filter((item) => {
          return item.gym.isApproved === "approved";
        });

        if (approvedGym.length !== 0) {
          setSelectedGym(result[0]);
        }
      },
    }
  );

  const approvedGyms = data?.filter((item) => {
    return item.gym.isApproved === "approved" && item.gym.plans.length > 0;
  });

  const registerUserMutation = useMutation(
    async (formData) => {
      return postRegisterUser(
        formData.firstname,
        formData.middlename,
        formData.lastname,
        formData.email,
        formData.contact,
        formData.address,
        formData.dateOfBirth,
        formData.plan,
        formData.gender,
        formData.password,
        formData.gymId,
        formData.paymentImage
      );
    },
    {
      onSuccess: (data) => {
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });
        navigate("/userlogin");
      },
      onError: (error) => {
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setLocation({ latitude, longitude });
          },
          (error) => {
            console.log("Error getting user location:", error);

            toast({
              title: "Error getting user location",
              status: "error",
              duration: 2000,
              position: "bottom-right",
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000, // Maximum time (in milliseconds) allowed for obtaining the position
            maximumAge: 0, // Maximum age (in milliseconds) of a possible cached position that is acceptable
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        toast({
          title: "Geolocation is not supported by this browser.",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      }
    };

    getLocation();
  }, []);

  const fetchDirections = async (gymLoc) => {
    setDirectionResponse(null);

    if (gymLoc.length === 0 || Array.isArray(location)) {
      return;
    }

    const directionService = new google.maps.DirectionsService();

    const results = await directionService.route({
      origin: new window.google.maps.LatLng(
        location.latitude,
        location.longitude
      ),
      destination: new window.google.maps.LatLng(gymLoc[0], gymLoc[1]),
      travelMode: google.maps.TravelMode.DRIVING,
    });

    return setDirectionResponse(results);
  };

  // console.log(approvedGyms);

  return (
    <>
      <UserSignUpModal
        modalName="User Sign Up"
        isModalOpen={isUserSignUpOpen}
        closeModal={closeUserSignUp}
        selectedGym={selectedGym}
        mutationFunc={registerUserMutation}
      />

      <UserJoinOtherGymModal
        isModalOpen={isUserJoinGymOpen}
        closeModal={closeUserJoinGym}
        selectedGym={selectedGym}
      />

      <Flex
        flexDirection="column"
        backgroundImage={`url(${backgroundImage})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        minHeight="100vh"
      >
        <Header />

        <Flex
          paddingTop="8rem"
          paddingBottom="8rem"
          marginInline="auto"
          width="full"
          justifyContent="space-between"
          paddingInline="5rem"
        >
          <ExploreBox
            setSelectedGym={setSelectedGym}
            selectedGym={selectedGym}
            fetchDirections={fetchDirections}
            owners={approvedGyms}
            openUserSignUp={openUserSignUp}
            openUserJoinGym={openUserJoinGym}
          />

          <Box
            position="relative"
            height="30rem"
            width="38rem"
            borderRadius="10px"
            padding="1rem"
            bgColor="neutral.100"
          >
            <Box position="absolute" left="0" top="0" h="100%" w="100%">
              {isLoaded && !isLoading && (
                <GoogleMap
                  // center={
                  //   !Array.isArray(location)
                  //     ? {
                  //         lat: location.latitude,
                  //         lng: location.longitude,
                  //       }
                  //     : center
                  // }
                  center={center}
                  zoom={13}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  clickableIcons={false}

                  // onClick={onMapClick}
                >
                  {approvedGyms?.map((item) => (
                    <MarkerF
                      key={item.gym._id}
                      position={{
                        lat: item.gym.gymLocation[0],
                        lng: item.gym.gymLocation[1],
                      }}
                      onMouseOver={() => setHoveredMarker(item.gym._id)}
                      onMouseOut={() => setHoveredMarker(null)}
                      onClick={
                        !Array.isArray(location) ||
                        item.gym.gymLocation.length !== 0
                          ? () => fetchDirections(item.gym.gymLocation)
                          : null
                      }
                    >
                      {hoveredMarker === item.gym._id && (
                        <InfoWindowF
                          position={{
                            lat: item.gym.gymLocation[0],
                            lng: item.gym.gymLocation[1],
                          }}
                        >
                          <div id="my-info-window">
                            <div>{item.gym.gymname}</div>
                            <img
                              src={item.gym.gymImage.url}
                              alt={item.gym.gymname}
                              style={{ width: "auto", height: "50px" }}
                            />
                          </div>
                        </InfoWindowF>
                      )}
                    </MarkerF>
                  ))}

                  {location && (
                    <>
                      <MarkerF
                        position={{
                          lat: location.latitude,
                          lng: location.longitude,
                        }}
                        icon={{
                          url: locationMarker,
                          scaledSize: new window.google.maps.Size(35, 35),
                        }}
                      />
                      <CircleF
                        center={{
                          lat: location.latitude,
                          lng: location.longitude,
                        }}
                        radius={3000}
                        options={{
                          fillColor: "#007bff",
                          fillOpacity: 0.2,
                          strokeColor: "#007bff",
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                        }}
                      />
                    </>
                  )}
                  {!Array.isArray(location) && directionResponse && (
                    <DirectionsRenderer directions={directionResponse} />
                  )}
                </GoogleMap>
              )}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Explore;

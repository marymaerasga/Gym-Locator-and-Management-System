import { useState, useEffect } from "react";
import { Center } from "@chakra-ui/react";
import GymSignUpDetails from "./GymSignUpDetails";
import GymSignUpInfo from "./GymSignUpInfo";
import GymSignUpPermit from "./GymSignUpPermit";
import gym from "../assets/images/background.webp";

const GymOwnerSignUp = () => {
  const [state, setState] = useState("details");
  const [signUpForm, setSignUpForm] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    password: "",
    gymname: "",
    contact: "",
    address: "",
    gymLocation: [],
    gcashNumber: "",
    description: "",
    startday: "",
    endday: "",
    opentime: "",
    closetime: "",
    gymImage: "",
    permitImage: "",
  });

  useEffect(() => {
    return () => {
      setSignUpForm({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        password: "",
        gymname: "",
        contact: "",
        address: "",
        gymLocation: [],
        gcashNumber: "",
        description: "",
        startday: "",
        endday: "",
        opentime: "",
        closetime: "",
        gymImage: "",
        permitImage: "",
      });
    };
  }, []);

  return (
    <Center
      minHeight="100vh"
      width="100%"
      backgroundImage={`url(${gym})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
    >
      {state === "details" && (
        <GymSignUpDetails
          setState={setState}
          setSignUpForm={setSignUpForm}
          signUpForm={signUpForm}
        />
      )}
      {state === "info" && (
        <GymSignUpInfo
          setState={setState}
          setSignUpForm={setSignUpForm}
          signUpForm={signUpForm}
        />
      )}
      {state === "permit" && (
        <GymSignUpPermit
          setState={setState}
          setSignUpForm={setSignUpForm}
          signUpForm={signUpForm}
        />
      )}
    </Center>
  );
};

export default GymOwnerSignUp;

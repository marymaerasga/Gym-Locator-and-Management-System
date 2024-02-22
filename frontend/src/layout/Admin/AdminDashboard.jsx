import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";
import { Link, Center, Flex, Icon, Image } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { FaHourglassHalf } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import axios from "axios";
import { useQuery } from "react-query";

const apiUrl =
  import.meta.env.MODE === "production"
    ? "https://gymlocator.co/api"
    : "http://localhost:5000/api";

const AdminDashboard = () => {
  const { data, isLoading, isError } = useQuery(
    "ownersList",
    async () => {
      return axios
        .get(`${apiUrl}/admin/owners`, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("adminInfo")).token
            }`,
          },
        })
        .then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        console.log("Query successful:", data);
        // Your logic for successful response
      },
      onError: (error) => {
        console.error("Query error:", error);
        // Your logic for handling errors
      },
    }
  );

  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem">
        Good day, Admin
      </Text>
      <Text
        color="gray"
        marginTop="0.5rem"
        fontSize="1.1rem"
        marginBottom="2rem"
      >
        Welcome to your personal Dashboard
      </Text>
      <Flex>
        <Flex boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)" padding="1rem">
          <Box>
            <Text marginBottom="0.5rem">GYM REGISTERED</Text>
            <Text fontSize="1.5rem">
              {
                data?.filter((owner) => owner.gym.isApproved === "approved")
                  .length
              }
            </Text>
          </Box>

          <Icon
            as={MdPeopleAlt}
            color="gray"
            fontSize="2.5rem"
            marginInline="2rem"
          />
        </Flex>
        <Flex
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
          padding="1rem"
          marginInline="1rem"
        >
          <Box>
            <Text marginBottom="0.5rem">PENDING REQUESTS</Text>
            <Text fontSize="1.5rem">
              {
                data?.filter((owner) => owner.gym.isApproved === "pending")
                  .length
              }
            </Text>
          </Box>

          <Icon
            as={FaHourglassHalf}
            color="gray"
            fontSize="2.5rem"
            marginInline="2rem"
          />
        </Flex>
        <Flex
          boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
          padding="1rem"
          marginInline="1rem"
        >
          <Box>
            <Text marginBottom="0.5rem">GYM REJECTED</Text>
            <Text fontSize="1.5rem">
              {
                data?.filter((owner) => owner.gym.isApproved === "rejected")
                  .length
              }
            </Text>
          </Box>

          <Icon
            as={ImCancelCircle}
            color="gray"
            fontSize="2.5rem"
            marginInline="2rem"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdminDashboard;

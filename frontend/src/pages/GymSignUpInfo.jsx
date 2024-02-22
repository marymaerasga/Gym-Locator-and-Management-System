import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Center,
  Input,
  Flex,
  VStack,
  Divider,
  HStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import gym from "../assets/images/background.webp";

const GymSignUpInfo = ({ setState, signUpForm, setSignUpForm }) => {
  const toast = useToast();

  return (
    <Box>
      <Text color="gray.100" fontSize="3rem" fontWeight="800">
        Welcome to{" "}
        <Text as="span" color="brand.100">
          GYM Locator
        </Text>
      </Text>
      <Text fontSize="1.1rem" color="gray.300" marginBlock="0.8rem">
        Please sign up to continue
      </Text>
      <Divider />
      <Text fontSize="1.1rem" color="gray.300" marginBlock="0.8rem">
        Gym Information
      </Text>

      <VStack spacing="0.8rem" width="full">
        <Input
          type="text"
          placeholder="Gym Name"
          bgColor="neutral.100"
          height="45px"
          width="100%"
          onChange={(e) =>
            setSignUpForm({
              ...signUpForm,
              gymname: e.target.value,
            })
          }
          value={signUpForm.gymname}
        />
        <Input
          type="number"
          placeholder="Contact Number"
          bgColor="neutral.100"
          height="45px"
          width="100%"
          onChange={(e) =>
            setSignUpForm({
              ...signUpForm,
              contact: e.target.value,
            })
          }
          value={signUpForm.contact}
        />
        <Input
          type="number"
          placeholder="GCash Number"
          bgColor="neutral.100"
          height="45px"
          width="100%"
          onChange={(e) =>
            setSignUpForm({
              ...signUpForm,
              gcashNumber: e.target.value,
            })
          }
          value={signUpForm.gcashNumber}
        />
        <Input
          type="text"
          placeholder="Address"
          bgColor="neutral.100"
          height="45px"
          width="100%"
          onChange={(e) =>
            setSignUpForm({
              ...signUpForm,
              address: e.target.value,
            })
          }
          value={signUpForm.address}
        />
        <Input
          type="text"
          placeholder="Gym Description"
          bgColor="neutral.100"
          height="45px"
          width="100%"
          onChange={(e) =>
            setSignUpForm({
              ...signUpForm,
              description: e.target.value,
            })
          }
          value={signUpForm.description}
        />
        <HStack>
          <HStack width="50%">
            <Box>
              <Text mb="8px" color="gray.300">
                Days Open
              </Text>
              <Select
                placeholder="Select option"
                bgColor="neutral.100"
                height="45px"
                onChange={(e) =>
                  setSignUpForm({
                    ...signUpForm,
                    startday: e.target.value,
                  })
                }
                value={signUpForm.startday}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Select>
            </Box>

            <Box>
              <Text mb="8px" color="gray.300">
                To
              </Text>
              <Select
                placeholder="Select option"
                bgColor="neutral.100"
                height="45px"
                onChange={(e) =>
                  setSignUpForm({
                    ...signUpForm,
                    endday: e.target.value,
                  })
                }
                value={signUpForm.endday}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Select>
            </Box>
          </HStack>
          <HStack width="50%">
            <Box>
              <Text mb="8px" color="gray.300">
                Opening Time
              </Text>

              <Input
                placeholder="Select Time"
                type="time"
                bgColor="neutral.100"
                height="45px"
                onChange={(e) =>
                  setSignUpForm({
                    ...signUpForm,
                    opentime: e.target.value,
                  })
                }
                value={signUpForm.opentime}
              />
            </Box>
            <Box>
              <Text mb="8px" color="gray.300">
                Closing Time
              </Text>

              <Input
                placeholder="Select Time"
                type="time"
                bgColor="neutral.100"
                height="45px"
                onChange={(e) =>
                  setSignUpForm({
                    ...signUpForm,
                    closetime: e.target.value,
                  })
                }
                value={signUpForm.closetime}
              />
            </Box>
          </HStack>
        </HStack>
      </VStack>
      <HStack>
        <Button
          width="100%"
          bgColor="brand.100"
          color="neutral.100"
          marginTop="1rem"
          height="45px"
          _hover={{ bgColor: "gray.400", color: "brand.200" }}
          fontSize="1.1rem"
          onClick={() => setState("details")}
        >
          Previous
        </Button>
        <Button
          width="100%"
          bgColor="brand.100"
          color="neutral.100"
          marginTop="1rem"
          height="45px"
          _hover={{ bgColor: "gray.400", color: "brand.200" }}
          fontSize="1.1rem"
          onClick={() => {
            if (
              signUpForm.gymname.length === 0 ||
              signUpForm.contact.length === 0 ||
              signUpForm.address.length === 0 ||
              signUpForm.description.length === 0 ||
              signUpForm.startday.length === 0 ||
              signUpForm.endday.length === 0 ||
              signUpForm.opentime.length === 0 ||
              signUpForm.closetime.length === 0
            ) {
              toast({
                title: "All fields are required",
                status: "error",
                duration: 2000,
                position: "bottom-right",
              });
              return;
            } else {
              setState("permit");
            }
          }}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default GymSignUpInfo;

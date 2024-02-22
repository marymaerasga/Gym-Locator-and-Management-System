import React from "react";
import { Text, Box, Flex, Button } from "@chakra-ui/react";

const TrainerProfile = () => {
  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Trainer Profile
      </Text>
      <Flex marginBottom="1rem" gap="8rem">
        <Box width="10rem">
          <Text color="gray" fontSize="1.3rem">
            Firstname
          </Text>
          <Text color="brand.200" fontSize="1.3rem">
            Mary
          </Text>
        </Box>

        <Box>
          <Text color="gray" fontSize="1.3rem">
            Lastname
          </Text>
          <Text color="brand.200" fontSize="1.3rem">
            Erasga
          </Text>
        </Box>
        <Box>
          <Text color="gray" fontSize="1.3rem">
            Age
          </Text>
          <Text color="brand.200" fontSize="1.3rem">
            23
          </Text>
        </Box>
      </Flex>
      <Flex marginBottom="1rem" gap="8rem">
        <Box>
          <Text color="gray" fontSize="1.3rem" width="10rem">
            Email Address
          </Text>
          <Text color="brand.200" fontSize="1.3rem">
            mary123@gmail.com
          </Text>
        </Box>
        <Box>
          <Text color="gray" fontSize="1.3rem">
            Address
          </Text>
          <Text whiteSpace="normal" color="brand.200" fontSize="1.3rem">
            Dona Martina Caragasan, Maasin
          </Text>
        </Box>
      </Flex>
      <Flex marginBottom="1rem" gap="8rem">
        <Box>
          <Text color="gray" fontSize="1.3rem" width="10rem">
            Phone Number
          </Text>
          <Text color="brand.200" fontSize="1.3rem">
            09254785654
          </Text>
        </Box>
        <Box>
          <Text color="gray" fontSize="1.3rem">
            Years of Experience
          </Text>
          <Text whiteSpace="normal" color="brand.200" fontSize="1.3rem">
            5 years
          </Text>
        </Box>
      </Flex>

      <Flex gap="8rem">
        <Box>
          <Text color="gray" fontSize="1.3rem" width="10rem">
            Specialties
          </Text>
          <Text color="brand.200" fontSize="1.3rem">
            Yoga
          </Text>
        </Box>
      </Flex>

      <Flex>
        <Button bgColor="brand.100" marginTop="3rem">
          Edit Profile
        </Button>
      </Flex>
    </Box>
  );
};

export default TrainerProfile;

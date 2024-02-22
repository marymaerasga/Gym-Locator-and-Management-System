import { useState, useEffect } from "react";
import {
  Flex,
  Icon,
  Box,
  Card,
  Image,
  Stack,
  CardBody,
  Heading,
  Text,
  CardFooter,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  Textarea,
  UnorderedList,
  ListItem,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
  useDisclosure,
} from "@chakra-ui/react";
import gym from "../../assets/images/gym-sample.jpg";
import { FaStar } from "react-icons/fa";

import StarRating from "../StarRating/StarRating";

import { useNavigate } from "react-router-dom";
import getAbbreviatedDay from "../../utils/getAbbreviatedDay";
import { formattedTime } from "../../utils/convertToAmericanTime";
import TokenService from "../../services/token";

const ExploreGymCard = ({
  owner,
  fetchDirections,
  selectedGym,
  setSelectedGym,
  openUserSignUp,
  openUserJoinGym,
}) => {
  const [review, setReview] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const firstDay = getAbbreviatedDay(owner.gym.schedule.startday);
  const endDay = getAbbreviatedDay(owner.gym.schedule.endday);
  const startTime = formattedTime(owner.gym.schedule.opentime);
  const endTime = formattedTime(owner.gym.schedule.closetime);

  const sum = owner.gym.reviews.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const averageReview = sum / owner.gym.reviews.length;

  const roundedAverage = averageReview.toFixed(1);

  // console.log(owner);

  // console.log(JSON.parse(TokenService.getUserLocal()).token);

  return (
    <Card
      direction="column"
      overflow="hidden"
      variant="outline"
      marginBlock="0.8rem"
      borderWidth="2px"
      cursor="pointer"
      _hover={{ bgColor: "gray.100" }}
    >
      {/* Join Other Gym Modal*/}

      <Flex>
        <Box position="relative" flexGrow="1" width="50%">
          <Image
            src={owner.gym.gymImage.url}
            alt=""
            boxSize="150px"
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </Box>

        <Stack paddingInline="0.5rem">
          <CardBody>
            <Heading size="md" color="brand.200">
              {owner.gym.gymname}
            </Heading>
            <HStack
              direction="row"
              spacing="0.2rem"
              marginTop="0.3rem"
              marginBottom="0.5rem"
            >
              <Text>
                {/* ({owner.gym.reviews.length !== 0 ? roundedAverage : 0}) */}
                {owner.gym.rating.toFixed(1)}
              </Text>

              <StarRating
                rating={owner.gym.rating}
                // rating={owner.gym.reviews.length !== 0 ? roundedAverage : 0}
              />
            </HStack>

            <Text>Opens at</Text>
            <Text>
              {startTime}-{endTime}
            </Text>
            <Text>
              {firstDay}-{endDay}
            </Text>
          </CardBody>
        </Stack>
      </Flex>
      <Tabs mt="1rem" position="relative" variant="unstyled">
        <TabList>
          <Tab fontSize="0.9rem" paddingInline="0.5rem" fontWeight="500">
            Gym Details
          </Tab>
          <Tab fontSize="0.9rem" paddingInline="0.5rem" fontWeight="500">
            Amenities
          </Tab>
          <Tab fontSize="0.9rem" paddingInline="0.5rem" fontWeight="500">
            Services
          </Tab>
          <Tab fontSize="0.9rem" paddingInline="0.5rem" fontWeight="500">
            Equipments
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel fontSize="1rem">
            <Box my="0.3rem">
              <Text fontWeight="bold">Gym Details</Text>
              <Text>- {owner.gym.description}</Text>
            </Box>
            <Box>
              <Text as="span" fontWeight="bold">
                Contact Phone:
              </Text>{" "}
              {owner.gym.contact}
            </Box>
            <Box>
              <Text as="span" fontWeight="bold">
                Email:
              </Text>{" "}
              {owner.email}
            </Box>
            <Box>
              <Text as="span" fontWeight="bold">
                Address:
              </Text>{" "}
              {owner.gym.address}
            </Box>
          </TabPanel>
          <TabPanel fontSize="1rem">
            <Box my="0.3rem">
              {owner.gym.amenities.length !== 0 ? (
                <UnorderedList>
                  {owner.gym.amenities.map((item) => (
                    <ListItem key={item._id}>{item.amenityName}</ListItem>
                  ))}
                </UnorderedList>
              ) : (
                <Text>n/a</Text>
              )}
            </Box>
          </TabPanel>
          <TabPanel fontSize="1rem">
            <Box my="0.3rem">
              {owner.gym.services.length !== 0 ? (
                <UnorderedList>
                  {owner.gym.services.map((item) => (
                    <ListItem key={item._id}>{item.serviceName}</ListItem>
                  ))}
                </UnorderedList>
              ) : (
                <Text>n/a</Text>
              )}
            </Box>
          </TabPanel>
          <TabPanel fontSize="1rem">
            <Box my="0.3rem">
              {owner.gym.equipments.length !== 0 ? (
                <UnorderedList>
                  {owner.gym.equipments.map((item) => (
                    <ListItem key={item._id}>{item.equipmentName}</ListItem>
                  ))}
                </UnorderedList>
              ) : (
                <Text>n/a</Text>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex justifyContent="space-evenly" marginBlock="1rem">
        <Button
          variant="solid"
          bgColor="brand.100"
          color="neutral.100"
          width="120px"
          _hover={{ color: "brand.100", bgColor: "gray.300" }}
          onClick={() => fetchDirections(owner.gym.gymLocation)}
        >
          Direction
        </Button>
        <Button
          variant="solid"
          bgColor="brand.100"
          color="neutral.100"
          width="120px"
          _hover={{ color: "brand.100", bgColor: "gray.300" }}
          onClick={() => {
            const userToken = JSON.parse(TokenService.getUserLocal());

            if (userToken) {
              openUserJoinGym();
            } else {
              openUserSignUp();
            }

            setSelectedGym(owner);
          }}
        >
          Join Now
        </Button>
      </Flex>
    </Card>
  );
};

export default ExploreGymCard;

import React from "react";
import {
  Card,
  Stack,
  CardBody,
  Image,
  Heading,
  Text,
  Button,
  ButtonGroup,
  CardFooter,
  Icon,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import gym from "../../assets/images/gym-sample.jpg";
import StarRating from "../StarRating/StarRating";

const FeatureGymCard = ({ owner }) => {
  return (
    <Card
      maxW="sm"
      boxShadow="rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
      marginInline="1rem"
    >
      <CardBody>
        <Image
          src={owner.gym.gymImage.url}
          alt="This is a gym"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading
            size="md"
            textAlign="center"
            fontWeight="800"
            fontSize="1.75rem"
          >
            {owner.gym.gymname}
          </Heading>
          {/* <Stack direction="row" justifyContent="center">
            <Icon as={FaStar} color="brand.100" />
            <Icon as={FaStar} color="brand.100" />
            <Icon as={FaStar} color="brand.100" />
            <Icon as={FaStar} color="brand.100" />
            <Icon as={FaStar} color="brand.100" />
          </Stack> */}
          <StarRating rating={owner.gym.rating} gap="0.38rem" />
          <Text textAlign="center">{owner.gym.description}</Text>
        </Stack>
      </CardBody>
      <CardFooter>
        <ButtonGroup spacing="2" marginInline="auto">
          {/* <Button bgColor="brand.100">Explore</Button>
          <Button bgColor="brand.100">Join now</Button> */}
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default FeatureGymCard;

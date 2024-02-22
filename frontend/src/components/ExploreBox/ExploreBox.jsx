import { useState, useEffect } from "react";
import ExploreGymCard from "../ExploreGymCard/ExploreGymCard";
import { IoSearch } from "react-icons/io5";
import {
  Box,
  Button,
  Icon,
  Flex,
  Input,
  InputRightElement,
  InputGroup,
  Select,
  Divider,
} from "@chakra-ui/react";
import useSearch from "../../store/public";

const ExploreBox = ({
  owners,
  fetchDirections,
  selectedGym,
  setSelectedGym,
  openUserSignUp,
  openUserJoinGym,
}) => {
  const { wordSearch, setWordSearch } = useSearch();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchStars, setSearchStars] = useState("");
  const [searchServices, setSearchService] = useState("");
  const [searchAmenity, setSearchAmenity] = useState("");

  // const filteredOwners = owners?.filter((owner) => {
  //   const gymName = owner.gym.gymname.toLowerCase();
  //   const includesSearchTerm = gymName.includes(searchTerm.toLowerCase());

  //   if (searchAmenity || searchService || searchStars) {
  //     const includesAmenityOrService =
  //       owner.gym.amenities.some(
  //         (amenity) =>
  //           amenity.amenityName &&
  //           amenity.amenityName
  //             .toLowerCase()
  //             .includes(searchAmenity.toLowerCase())
  //       ) ||
  //       owner.gym.services.some(
  //         (service) =>
  //           service.serviceName &&
  //           service.serviceName
  //             .toLowerCase()
  //             .includes(searchService.toLowerCase())
  //       );

  //     const includesRating = searchStars
  //       ? owner.gym.rating >= parseInt(searchStars) &&
  //         owner.gym.rating < parseInt(searchStars) + 1
  //       : true;

  //     return includesSearchTerm && includesAmenityOrService && includesRating;
  //   }

  //   return includesSearchTerm;
  // });

  // const filteredOwners = owners?.filter((owner) => {
  //   const gymName = owner.gym.gymname.toLowerCase();
  //   const includesSearchTerm = gymName.includes(searchTerm.toLowerCase());

  //   if (searchAmenity || searchService || searchStars !== "") {
  //     const includesAmenityOrService =
  //       owner.gym.amenities.some(
  //         (amenity) =>
  //           amenity.amenityName &&
  //           amenity.amenityName
  //             .toLowerCase()
  //             .includes(searchAmenity.toLowerCase())
  //       ) ||
  //       owner.gym.services.some(
  //         (service) =>
  //           service.serviceName &&
  //           service.serviceName
  //             .toLowerCase()
  //             .includes(searchService.toLowerCase())
  //       );

  //     const includesRating =
  //       searchStars !== ""
  //         ? owner.gym.rating >= parseInt(searchStars) &&
  //           owner.gym.rating < parseInt(searchStars) + 1
  //         : true;

  //     // Check if at least one condition is true
  //     return includesSearchTerm && includesAmenityOrService && includesRating;
  //   }

  //   return includesSearchTerm;
  // });

  // const filteredOwners = owners?.filter((owner) => {
  //   const gymName = owner.gym.gymname.toLowerCase();
  //   const includesSearchTerm = gymName.includes(searchTerm.toLowerCase());

  //   if (
  //     searchStars !== "" ||
  //     searchAmenity
  //     // || searchService
  //   ) {
  //     const includesAmenity =
  //       owner.gym.amenities &&
  //       owner.gym.amenities.length > 0 &&
  //       owner.gym.amenities.some(
  //         (amenity) =>
  //           amenity.amenityName &&
  //           amenity.amenityName
  //             .toLowerCase()
  //             .includes(searchAmenity.toLowerCase())
  //       );

  //     // ||
  //     //   (owner.gym.services &&
  //     //     owner.gym.services.length > 0 &&
  //     //     owner.gym.services.some(
  //     //       (service) =>
  //     //         service.serviceName &&
  //     //         service.serviceName
  //     //           .toLowerCase()
  //     //           .includes(searchService.toLowerCase())
  //     //     ));

  //     const includesRating =
  //       searchStars !== ""
  //         ? owner.gym.rating >= parseInt(searchStars) &&
  //           owner.gym.rating < parseInt(searchStars) + 1
  //         : true;

  //     return (
  //       includesSearchTerm &&
  //       includesAmenity &&
  //       // OrService
  //       includesRating
  //     );
  //   }

  //   return includesSearchTerm;
  // });

  const filteredOwners = owners?.filter((owner) => {
    const gym = owner.gym;
    const gymName = gym.gymname.toLowerCase();
    const includesSearchTerm = gymName.includes(searchTerm.toLowerCase());

    if ((searchAmenity || searchServices) && searchStars !== "") {
      const includesAmenity =
        gym.amenities &&
        gym.amenities.length > 0 &&
        gym.amenities.some(
          (amenity) =>
            amenity.amenityName &&
            amenity.amenityName
              .toLowerCase()
              .includes(searchAmenity.toLowerCase())
        );

      const includesServices =
        gym.services &&
        gym.services.length > 0 &&
        gym.services.some(
          (service) =>
            service.serviceName &&
            service.serviceName
              .toLowerCase()
              .includes(searchServices.toLowerCase())
        );

      const includesRating =
        searchStars !== ""
          ? gym.rating >= parseInt(searchStars) &&
            gym.rating < parseInt(searchStars) + 1
          : true;

      return (
        includesSearchTerm &&
        (includesAmenity || includesServices) &&
        includesRating
      );
    } else if (searchAmenity || searchServices) {
      const includesAmenity =
        gym.amenities &&
        gym.amenities.length > 0 &&
        gym.amenities.some(
          (amenity) =>
            amenity.amenityName &&
            amenity.amenityName
              .toLowerCase()
              .includes(searchAmenity.toLowerCase())
        );

      const includesServices =
        gym.services &&
        gym.services.length > 0 &&
        gym.services.some(
          (service) =>
            service.serviceName &&
            service.serviceName
              .toLowerCase()
              .includes(searchServices.toLowerCase())
        );

      return includesSearchTerm && (includesAmenity || includesServices);
    } else if (searchStars !== "") {
      const includesRating =
        searchStars !== ""
          ? gym.rating >= parseInt(searchStars) &&
            gym.rating < parseInt(searchStars) + 1
          : true;

      return includesSearchTerm && includesRating;
    }

    return includesSearchTerm;
  });

  const allAmenity = owners?.flatMap((owner) => owner.gym.amenities);
  const filteredAmenity = allAmenity?.map((item) => {
    return item.amenityName;
  });

  const allService = owners?.flatMap((owner) => owner.gym.services);
  const filteredService = allService?.map((item) => {
    return item.serviceName;
  });

  useEffect(() => {
    if (wordSearch.length !== 0) {
      setSearchTerm(wordSearch);
    }

    return () => {
      setWordSearch("");
    };
  }, []);

  console.log(owners);

  return (
    <Flex
      flexDirection="column"
      width="32rem"
      bgColor="neutral.100"
      padding="2rem"
      borderRadius="10px"
    >
      <InputGroup
        bgColor="neutral.100"
        borderRadius="30px"
        alignItems="center"
        marginBottom="2rem"
      >
        <Input
          pr="4.5rem"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for..."
          borderRadius="30px"
          height="56px"
          color="accent.500"
        />
        <InputRightElement
          width="7rem"
          bgColor="none"
          height="full"
          borderRadius="30px"
        >
          <Button
            color="neutral.100"
            bgColor="brand.100"
            type="submit"
            borderRadius="20px"
            width="50%"
            _hover={{ bgColor: "gray" }}
            onClick={() => console.log(filteredAmenity)}
          >
            <Icon as={IoSearch} />
          </Button>
        </InputRightElement>
      </InputGroup>
      <Flex marginBottom="1rem">
        <Select
          placeholder="Ratings"
          marginRight="0.5rem"
          borderRadius="20px"
          cursor="pointer"
          onChange={(e) => setSearchStars(e.target.value)}
        >
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </Select>
        <Select
          placeholder="Services"
          marginRight="0.5rem"
          borderRadius="20px"
          cursor="pointer"
          onChange={(e) => setSearchService(e.target.value)}
        >
          {filteredService?.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Amenities"
          borderRadius="20px"
          cursor="pointer"
          onChange={(e) => setSearchAmenity(e.target.value)}
        >
          {filteredAmenity?.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Flex>
      <Divider />
      <Box maxHeight="300px" overflow="auto">
        {owners?.length === 0 ? (
          <Box
            textAlign="center"
            marginBlock="2rem"
            fontWeight="600"
            fontSize="1.3rem"
          >
            "No Results Found"
          </Box>
        ) : (
          filteredOwners?.map((item) => (
            <ExploreGymCard
              key={item._id}
              owner={item}
              fetchDirections={fetchDirections}
              setSelectedGym={setSelectedGym}
              selectedGym={selectedGym}
              openUserSignUp={openUserSignUp}
              openUserJoinGym={openUserJoinGym}
            />
          ))
        )}
      </Box>
    </Flex>
  );
};

export default ExploreBox;

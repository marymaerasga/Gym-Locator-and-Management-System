import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Button,
  Flex,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import gym from "../../assets/images/gym-sample.jpg";

const AdminManageModal = ({
  isOpen,
  onClose,
  owner,
  updateGymStatusMutation,
}) => {
  if (!owner) {
    return null; // Don't render the modal if no owner is selected
  }

  const handleApproveGym = async (e) => {
    e.preventDefault();

    try {
      updateGymStatusMutation.mutate({ action: "approve", id: owner._id });
    } catch (error) {
      console.error("Update gym status failed:", error.message);
    }
  };

  const handleRejectGym = (e) => {
    e.preventDefault();

    try {
      updateGymStatusMutation.mutate({ action: "reject", id: owner._id });
    } catch (error) {
      console.error("Update gym status failed:", error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box width="full" marginBottom="1rem">
            <Image
              src={owner.gym.gymImage.url}
              alt="This is a gym"
              borderRadius="lg"
              width="100%"
              height="200px"
              objectFit="cover"
            />
          </Box>

          <Text>Gym Name: {owner.gym.gymname}</Text>
          <Text>
            Owner: {owner.firstname} {owner.lastname}
          </Text>
          <Text>Address: {owner.gym.address}</Text>
          <Text>Contact: {owner.gym.contact}</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleApproveGym}
            isLoading={updateGymStatusMutation.isLoading}
          >
            Approve
          </Button>
          <Button
            colorScheme="red"
            mr={3}
            onClick={handleRejectGym}
            isLoading={updateGymStatusMutation.isLoading}
          >
            Reject
          </Button>
          <Button
            colorScheme="gray"
            mr={3}
            onClick={onClose}
            // isLoading={updateGymStatusMutation.isLoading}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminManageModal;

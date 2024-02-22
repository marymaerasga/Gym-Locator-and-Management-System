import React, { useEffect } from "react";
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
  Link,
} from "@chakra-ui/react";
import gym from "../../assets/images/gym-sample.jpg";

const PendingMemberModal = ({
  isOpen,
  onClose,
  member,
  updateMemberStatusMutation,
}) => {
  if (!member) {
    return null; // Don't render the modal if no owner is selected
  }

  const handleApproveMember = async (e) => {
    e.preventDefault();

    try {
      updateMemberStatusMutation.mutate({
        userId: member.user._id,
        action: "approve",
      });
    } catch (error) {
      console.error("Update member status failed:", error.message);
    }
  };

  const handleRejectMember = (e) => {
    e.preventDefault();

    try {
      updateMemberStatusMutation.mutate({
        userId: member.user._id,
        action: "reject",
      });
    } catch (error) {
      console.error("Update member status failed:", error.message);
    }
  };

  //   console.log(member);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Link href={member.plan.proofOfPayment.url} isExternal>
            <Box width="full" marginBottom="1rem">
              <Image
                src={member.plan.proofOfPayment.url}
                alt="This is a gym"
                borderRadius="lg"
                width="100%"
                height="200px"
                objectFit="cover"
                cursor="pointer"
              />
            </Box>
          </Link>
          <Text>
            Member Name:{" "}
            {`${member.user.lastname}, ${member.user.firstname} ${member.user.middlename} `}
          </Text>
          <Text>Membership Type: {member.plan.planName}</Text>
          <Text>
            Amount:{" "}
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(member.plan.amount)}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleApproveMember}
            // isLoading={updateMemberStatusMutation.isLoading}
          >
            Approve
          </Button>
          <Button
            colorScheme="red"
            mr={3}
            onClick={handleRejectMember}
            // isLoading={updateMemberStatusMutation.isLoading}
          >
            Reject
          </Button>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PendingMemberModal;

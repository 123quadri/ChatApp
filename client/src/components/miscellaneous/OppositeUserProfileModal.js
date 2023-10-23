import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { authendpoints } from "../../services/apis";
import { ChatState } from "../../Context/ChatProvider";
import toast from "react-hot-toast";

const OppositeUserProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent h="410px">

          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            className='flex flex-row items-center'
          >
            {user?.name}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
              <div className="flex flex-row justify-evenly">
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={user?.pic}
                    alt={user?.name}
                  />

                
                  
              </div>

            <div>
              <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                className='flex justify-center'
              >
                Email: {user?.email}
              </Text>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  )
}

export default OppositeUserProfileModal
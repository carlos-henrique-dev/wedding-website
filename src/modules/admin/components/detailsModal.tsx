import { IGuest } from '@/interfaces'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text, Divider, List, VStack, HStack, Box, AbsoluteCenter } from '@chakra-ui/react'

interface IDetailsModalProps {
  invite?: IGuest
  isOpen: boolean
  onClose: () => void
}

export default function DetailsModal({ invite, isOpen, onClose }: IDetailsModalProps) {
  if (!invite) return null

  const confirmationColor = () => {
    if (invite.absent || !invite.confirmed) return 'red.300'

    return 'green.300'
  }

  const confirmationLabel = () => {
    if (invite.absent) return 'Convidado não comparecerá'

    return invite.confirmed ? 'Convite aceito' : 'Convite não confirmado'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{
        base: 'sm',
        sm: 'sm',
        md: 'md',
        lg: 'xl',
        xl: 'xl',
      }}
    >
      <ModalOverlay />

      <ModalContent mx={2}>
        <ModalHeader>{invite.family}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={2} align="start">
            <VStack w="full" align="start" py={2}>
              <HStack>
                <CheckIcon color={invite.inviteSent ? 'green.300' : 'red.300'} />
                <Text fontSize="sm" color="gray.500">
                  {invite.inviteSent ? 'Convite enviado' : 'Convite não enviado'}
                </Text>
              </HStack>

              <HStack>
                {invite.absent ? <CloseIcon color="red.300" /> : <CheckIcon color={confirmationColor()} />}
                <Text fontSize="sm" color="gray.500">
                  {confirmationLabel()}
                </Text>
              </HStack>
            </VStack>

            <Box w="full" position="relative" my={2}>
              <Divider color="gray.200" />
              <AbsoluteCenter bg="white" px={4}>
                <Text fontSize="sm" color="gray.500">
                  Membros
                </Text>
              </AbsoluteCenter>
            </Box>

            <List spacing={1}>
              {invite.members.map((member, index) => (
                <HStack key={index} align="center" justify="start">
                  <CheckIcon color={invite.confirmed ? 'green.300' : 'red.300'} />
                  <Text>{member.name}</Text>
                </HStack>
              ))}
            </List>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

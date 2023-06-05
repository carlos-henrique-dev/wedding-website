import { IGuest } from '@/interfaces'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Divider,
  List,
  VStack,
  HStack,
  Box,
  AbsoluteCenter,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react'

interface IDetailsModalProps {
  invites: IGuest[]
  isOpen: boolean
  onClose: () => void
}

export default function ReportModal({ invites, isOpen, onClose }: IDetailsModalProps) {
  function calculateAbsent() {
    return invites.reduce((acc, invite) => {
      if (!invite.inviteSent || invite.openedTimes === 0) {
        return acc
      }

      return acc + invite.members.filter((member) => !member.is_coming).length
    }, 0)
  }

  const createdInvites = invites.length
  const sentInvites = invites.filter((invite) => invite.inviteSent).length

  const totalInvited = invites.reduce((acc, invite) => acc + invite.members.length, 0)
  const totalConfirmed = invites.reduce((acc, invite) => acc + invite.members.filter((member) => member.is_coming).length, 0)
  const totalAbsent = calculateAbsent()

  const brideInvites = invites.filter((invite) => invite.side === 'bride').reduce((acc, invite) => acc + invite.members.length, 0)
  const groomInvites = invites.filter((invite) => invite.side === 'groom').reduce((acc, invite) => acc + invite.members.length, 0)

  if (!invites.length) return null

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
        <ModalHeader>Relatórios</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={2} w="full">
            <Box w="full" position="relative" my={2}>
              <Divider color="gray.200" />
              <AbsoluteCenter bg="white" px={4}>
                <Text fontSize="sm" color="gray.500">
                  Convites
                </Text>
              </AbsoluteCenter>
            </Box>

            <HStack spacing={2} align="start" justify="center" w="full">
              <Stat>
                <StatLabel>Criados</StatLabel>
                <StatNumber>{createdInvites}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Enviados</StatLabel>
                <StatNumber>{sentInvites}</StatNumber>
              </Stat>
            </HStack>

            <Box w="full" position="relative" my={2}>
              <Divider color="gray.200" />
              <AbsoluteCenter bg="white" px={4}>
                <Text fontSize="sm" color="gray.500">
                  Convidados
                </Text>
              </AbsoluteCenter>
            </Box>

            <HStack spacing={2} align="start" justify="space-between" w="full">
              <Stat>
                <StatLabel>Total</StatLabel>
                <StatNumber>{totalInvited}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Confirmados</StatLabel>
                <StatNumber>{totalConfirmed}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Não comparecerá</StatLabel>
                <StatNumber>{totalAbsent}</StatNumber>
              </Stat>
            </HStack>

            <Box w="full" position="relative" my={2}>
              <Divider color="gray.200" />
              <AbsoluteCenter bg="white" px={4}>
                <Text fontSize="sm" color="gray.500">
                  Convidados por lado
                </Text>
              </AbsoluteCenter>
            </Box>

            <HStack spacing={2} align="start" justify="space-between" w="full">
              <Stat>
                <StatLabel>Da Noiva</StatLabel>
                <StatNumber>{brideInvites}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Do Noivo</StatLabel>
                <StatNumber>{groomInvites}</StatNumber>
              </Stat>
            </HStack>
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

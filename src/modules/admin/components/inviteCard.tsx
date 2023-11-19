import { IGuest } from '@/interfaces'
import { CopyIcon, CheckIcon, DeleteIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import { Card, HStack, VStack, Divider, Text, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure, Heading, Center } from '@chakra-ui/react'
import { useRef } from 'react'
import { GROUP_OPTIONS } from '../constants'
import CreateInviteModal from './createInviteModal'

interface IInviteCardProps {
  invite: IGuest
  copyToClipboard: (text: string) => void
  openDetails: (invite: IGuest) => void
  onDeleteInvite: (code: string) => void
}

export default function InviteCard({ invite, copyToClipboard, openDetails, onDeleteInvite }: IInviteCardProps) {
  const { isOpen, onOpen: deleteInvite, onClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditInviteOpen, onClose: onEditEnd } = useDisclosure()

  const cancelRef = useRef(null)

  const handleDelete = () => {
    onClose()
    onDeleteInvite(invite.code)
  }

  const confirmationColor = () => {
    if (invite.absent || !invite.confirmed) return 'red.300'

    return 'green.300'
  }

  const confirmationLabel = () => {
    if (invite.absent) return 'Convidado não comparecerá'

    return invite.confirmed ? 'Convite aceito' : 'Convite não confirmado'
  }

  const getGroup = () => {
    const option = GROUP_OPTIONS.find((option) => option.value === invite.group)

    return option ? `(${option?.label})` : ''
  }

  return (
    <>
      <Card p={4} cursor="pointer" _hover={{ scale: 1.05 }}>
        <HStack justify="space-between" mb={2}>
          <VStack onClick={() => openDetails(invite)}>
            <Heading as="h5" size="xs" color={invite.confirmed ? 'green.300' : 'red.300'} flexDirection="row">
              {invite.family}{' '}
              <Text color="gray.400" fontSize="sm" as="p" fontWeight="normal" display="inline-block">
                {getGroup()}
              </Text>
            </Heading>
          </VStack>

          <HStack spacing={4}>
            <EditIcon color="blue.600" onClick={onEditInviteOpen} fontSize={20} />

            <DeleteIcon color="red.300" onClick={deleteInvite} fontSize={20} />

            <Center height="20px">
              <Divider orientation="vertical" />
            </Center>

            <CopyIcon color="green.600" onClick={() => copyToClipboard(invite.code)} fontSize={20} />
          </HStack>
        </HStack>

        <Divider color="gray.200" />

        <VStack w="full" align="start" py={2} onClick={() => openDetails(invite)}>
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

          <HStack align="end" justify="end" w="full" style={{ position: 'absolute', bottom: 5, right: 5 }}>
            <Text fontSize="sm" color="gray.500" style={{ fontWeight: 'bold' }}>
              {invite.side === 'bride' ? 'Noiva' : 'Noivo'}
            </Text>
          </HStack>
        </VStack>
      </Card>

      {isEditOpen && <CreateInviteModal isOpen={isEditOpen} onClose={onEditEnd} invite={invite} />}

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Apagar convite
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>Convite: {invite.family}</Text>
              <Text>Tem certeza que quer remover este convite?</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

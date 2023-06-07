import { IGuest } from '@/interfaces'
import { CopyIcon, CheckIcon, DeleteIcon, CloseIcon } from '@chakra-ui/icons'
import { Card, HStack, VStack, Divider, Text, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from '@chakra-ui/react'
import { useRef } from 'react'

interface IInviteCardProps {
  invite: IGuest
  copyToClipboard: (text: string) => void
  openDetails: (invite: IGuest) => void
  onDeleteInvite: (code: string) => void
}

export default function InviteCard({ invite, copyToClipboard, openDetails, onDeleteInvite }: IInviteCardProps) {
  const { isOpen, onOpen: deleteInvite, onClose } = useDisclosure()
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

  return (
    <>
      <Card p={4} cursor="pointer" _hover={{ scale: 1.05 }}>
        <HStack justify="space-between">
          <VStack onClick={() => openDetails(invite)}>
            <Text fontSize="xl" color={invite.confirmed ? 'green.300' : 'red.300'}>
              {invite.family}
            </Text>
          </VStack>

          <HStack spacing={2}>
            <DeleteIcon color="red.300" onClick={deleteInvite} />
            <CopyIcon color="blue.600" onClick={() => copyToClipboard(invite.code)} />
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

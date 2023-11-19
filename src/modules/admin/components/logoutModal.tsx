import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'
import { useRef } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: Props) {
  const cancelRef = useRef(null)

  const onConfirmLogout = () => {
    signOut({
      redirect: false,
    })
  }

  return (
    <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Deseja sair?</AlertDialogHeader>

        <AlertDialogCloseButton />

        <AlertDialogBody>Você terá que fazer login novamente para acessar o painel de gestão de convidados.</AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Não
          </Button>

          <Button colorScheme="red" ml={3} onClick={onConfirmLogout}>
            Sim
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

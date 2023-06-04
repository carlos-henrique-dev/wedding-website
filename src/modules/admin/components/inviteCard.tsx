import { IGuest } from '@/interfaces'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'
import { Card, HStack, VStack, Divider, Text } from '@chakra-ui/react'

interface IInviteCardProps {
  invite: IGuest
  copyToClipboard: (text: string) => void
  openDetails: (invite: IGuest) => void
}

export default function InviteCard({ invite, copyToClipboard, openDetails }: IInviteCardProps) {
  return (
    <Card p={4} cursor="pointer" _hover={{ scale: 1.05 }}>
      <HStack justify="space-between">
        <VStack onClick={() => openDetails(invite)}>
          <Text fontSize="xl" color={invite.confirmed ? 'green.300' : 'red.300'}>
            {invite.family}
          </Text>
        </VStack>

        <CopyIcon onClick={() => copyToClipboard(invite.code)} />
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
          <CheckIcon color={invite.confirmed ? 'green.300' : 'red.300'} />
          <Text fontSize="sm" color="gray.500">
            {invite.confirmed ? 'Convite aceito' : 'Convite não confirmado'}
          </Text>
        </HStack>
      </VStack>
    </Card>
  )
}

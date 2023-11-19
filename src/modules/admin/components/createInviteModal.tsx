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
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  HStack,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  Select,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { GROUP_OPTIONS } from '../constants'

interface IDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  invite?: IGuest
}

export default function CreateInviteModal({ isOpen, onClose, invite }: IDetailsModalProps) {
  const toast = useToast()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<{
    family: string
    side: string
    members: Array<{ value: string }>
    group: string
  }>({
    defaultValues: {
      side: invite?.side || 'bride',
      family: invite?.family || undefined,
      group: invite?.group || undefined,
      members: invite?.members.map((member) => ({ value: member.name })) || undefined,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'members' })

  const alreadyRunAppend = useRef(false)

  useEffect(() => {
    if (alreadyRunAppend.current || (invite?.members.length && invite?.members.length > 0)) {
      alreadyRunAppend.current = true
      return
    }

    append({ value: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = () => {
    reset()
    fields.map((_, index: number) => remove(index))
    onClose()
  }

  async function onSubmit(values: any) {
    const code = values.family
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '-')
      .replace(/\./g, '')
      .toLowerCase()

    const data: IGuest = {
      code,
      family: values.family,
      side: values.side,
      members: values.members.map((member: any) => ({
        name: member.value,
        is_coming: false,
      })),
      confirmed: false,
      absent: false,
      inviteSent: false,
      openedTimes: 0,
      group: values.group,
    }

    const method = invite ? 'PUT' : 'POST'

    const body = invite ? JSON.stringify({ ...data, oldCode: invite.code }) : JSON.stringify(data)

    try {
      const result = await fetch('/api/invite', { method, body })

      if (result.status !== 200) {
        throw new Error(result.statusText)
      }

      toast({
        title: invite ? 'Convite atualizado!' : 'Convite criado!',
        description: invite ? 'O convite foi atualizado com sucesso.' : 'O convite foi criado com sucesso.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: invite ? 'Erro ao atualizar convite' : 'Erro ao criar convite',
        description: invite ? 'Ocorreu um erro ao atualizar o convite. Tente novamente mais tarde.' : 'Ocorreu um erro ao criar o convite. Tente novamente mais tarde.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })

      console.error({ err })
    } finally {
      handleClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
        <ModalHeader>Criar um novo Convite</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={5} align="start">
            <FormControl isInvalid={!!errors.side}>
              <FormLabel htmlFor="family">Convite para qual lado?</FormLabel>
              <Controller
                name="side"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} colorScheme="green">
                    <Stack direction="row">
                      <Radio value="bride">Noiva</Radio>
                      <Radio value="groom">Noivo</Radio>
                    </Stack>
                  </RadioGroup>
                )}
                rules={{
                  required: { value: true, message: 'Este campo é obrigatório.' },
                }}
              />

              <FormErrorMessage>{String(errors?.side?.message)}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.group}>
              <FormLabel htmlFor="group">Grupo</FormLabel>
              <Controller
                name="group"
                control={control}
                render={({ field }) => (
                  <Select placeholder="Selecione um grupo" {...field}>
                    {GROUP_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
                rules={{
                  required: { value: true, message: 'Este campo é obrigatório.' },
                }}
              />

              <FormErrorMessage>{String(errors?.group?.message)}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.family}>
              {invite && (
                <Alert status="warning">
                  <AlertIcon />
                  <Text>
                    Caso altere o <Text as={({ children }: any) => <b>{children}</b>}>nome da família</Text>, a URL do convite será alterada. Se já tiver enviado o convite, envie novamente para que o link seja
                    atualizado.
                  </Text>
                </Alert>
              )}

              <FormLabel htmlFor="family">Nome da família</FormLabel>
              <Input
                id="family"
                placeholder="John and Jane"
                {...register('family', {
                  required: 'Nome da família é obrigatório',
                  minLength: { value: 3, message: 'Pelo menos 3 letras' },
                })}
              />
              <FormErrorMessage>{String(errors?.family?.message)}</FormErrorMessage>
            </FormControl>

            <VStack spacing={2} align="start" w="full">
              {fields.map((field: any, index: any) => (
                <HStack key={field.id} align="end" my={1} w="full">
                  <FormControl isInvalid={!!errors?.members?.[index]}>
                    <FormLabel htmlFor="members">Membro</FormLabel>
                    <Input
                      id="members"
                      placeholder="John"
                      {...register(`members.${index}.value`, {
                        required: 'Campo obrigatório',
                        minLength: { value: 3, message: 'Pelo menos 3 letras' },
                      })}
                    />
                    <FormErrorMessage>{String(errors?.members?.[index]?.value?.message)}</FormErrorMessage>
                  </FormControl>

                  <Button colorScheme="red" onClick={() => remove(index)}>
                    Remover
                  </Button>
                </HStack>
              ))}
            </VStack>

            <Button colorScheme="green" onClick={() => append({ value: '' })}>
              Adicionar membro
            </Button>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={4}>
            <Button colorScheme="red" size="sm" onClick={handleClose}>
              Fechar
            </Button>

            <Button colorScheme="green" size="sm" isLoading={isSubmitting} type="submit" onClick={handleSubmit(onSubmit)}>
              Salvar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

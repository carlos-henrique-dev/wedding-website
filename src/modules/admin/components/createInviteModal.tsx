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
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

import { Controller, useFieldArray, useForm } from 'react-hook-form'

interface IDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateInviteModal({ isOpen, onClose }: IDetailsModalProps) {
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
  }>({
    defaultValues: {
      side: 'bride',
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'members' })

  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) {
      ran.current = true
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
    }

    await fetch('/api/new-invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch((err) => console.log({ err }))

    toast({
      title: 'Convite criado.',
      description: 'Convite criado com sucesso!',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })

    handleClose()
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
                  required: { value: true, message: 'This is required.' },
                }}
              />

              <FormErrorMessage>{String(errors?.side?.message)}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.family}>
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

import { IGuest, IMember } from "@/interfaces";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
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
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface IDetailsModalProps {
  invite?: IGuest;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailsModal({
  invite,
  isOpen,
  onClose,
}: IDetailsModalProps) {
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  const { handleSubmit, register, control, reset, setValue } = useForm<{
    members: Array<IMember>;
  }>({
    defaultValues: {
      members: invite?.members || [],
    },
  });

  const { fields, update } = useFieldArray({ control, name: "members" });

  useEffect(() => {
    if (invite && invite?.members && isOpen) {
      setValue("members", invite?.members);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invite, isOpen]);

  const handleClose = () => {
    setIsEditEnabled(false);

    reset();
    onClose();
  };

  if (!invite) return null;

  const handleUpdate = async (values: any) => {
    setIsSaving(true);

    const isInviteAccepted = values.members.some(
      (member: IMember) => member.is_coming,
    );

    const data: IGuest = {
      ...invite,
      members: values.members,
      confirmed: isInviteAccepted,
    };

    try {
      const result = await fetch("/api/invite", {
        method: "PUT",
        body: JSON.stringify({ ...data, oldCode: invite?.code }),
      });

      if (result.status !== 200) {
        throw new Error(result.statusText);
      }

      toast({
        title: "Convite atualizado!",
        description: "O convite foi atualizado com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Erro ao atualizar convite",
        description:
          "Ocorreu um erro ao atualizar o convite. Tente novamente mais tarde.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      console.error({ err });
    } finally {
      setIsSaving(false);

      handleClose();
    }
  };

  const confirmationColor = () => {
    if (invite.absent || !invite.confirmed) return "red.300";

    return "green.300";
  };

  const confirmationLabel = () => {
    if (invite.absent) return "Convidado não comparecerá";

    return invite.confirmed ? "Convite aceito" : "Convite recusado";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={{
        base: "sm",
        sm: "sm",
        md: "md",
        lg: "xl",
        xl: "xl",
      }}
    >
      <ModalOverlay />

      <ModalContent mx={2}>
        <ModalHeader>
          <Flex height="60px" align="flex-end">
            <Box flex="2">
              <Heading size="md">{invite.family}</Heading>
            </Box>

            <Box flex="1">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="enable-edit" mb="0">
                  Ativar edição?
                </FormLabel>
                <Switch
                  id="enable-edit"
                  isChecked={isEditEnabled}
                  onChange={() => setIsEditEnabled(!isEditEnabled)}
                />
              </FormControl>
            </Box>
          </Flex>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={2} align="start" w="full">
            <VStack w="full" align="start" py={2}>
              <HStack>
                <CheckIcon
                  color={invite.inviteSent ? "green.300" : "red.300"}
                />
                <Text fontSize="sm" color="gray.500">
                  {invite.inviteSent
                    ? "Convite enviado"
                    : "Convite não enviado"}
                </Text>
              </HStack>

              <HStack>
                {invite.absent ? (
                  <CloseIcon color="red.300" />
                ) : (
                  <CheckIcon color={confirmationColor()} />
                )}
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

            <List spacing={1} w="full">
              {fields.map((field: IMember, index: any) => (
                <HStack key={index} w="full">
                  <HStack flex="1">
                    {field.is_coming ? (
                      <CheckIcon color="green.300" />
                    ) : (
                      <CloseIcon color="red.300" />
                    )}

                    <Text>{field.name}</Text>
                  </HStack>

                  {isEditEnabled && (
                    <Box>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor={`${field.name}-is-coming`} mb="0">
                          {field.is_coming ? "Confirmado" : "Não confirmado"}
                        </FormLabel>

                        <Switch
                          colorScheme="green"
                          id={`${field.name}-is-coming`}
                          {...register(`members.${index}.is_coming`)}
                          onChange={() => {
                            const _update = {
                              ...field,
                              is_coming: !field.is_coming,
                            };
                            update(index, _update);
                          }}
                        />
                      </FormControl>
                    </Box>
                  )}
                </HStack>
              ))}
            </List>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            {isEditEnabled && (
              <Button
                colorScheme="green"
                size="sm"
                onClick={handleSubmit(handleUpdate)}
                disabled={isSaving}
                isLoading={isSaving}
              >
                Salvar
              </Button>
            )}

            <Button
              colorScheme="red"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
            >
              Fechar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  ChakraProvider,
  Container,
  Heading,
  VStack,
  Divider,
  Center,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  FormControl,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const toast = useToast();

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{
    username: string;
    password: string;
  }>();

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      setLoading(true);

      const body = {
        username: data.username,
        password: data.password,
        csrfToken: csrfToken,
      };

      const result = await signIn("credentials", {
        redirect: false,
        ...body,
      });

      if (result?.status !== 200) {
        throw new Error("Usuário ou senha incorretos.");
      }

      toast({
        title: "Sucesso!",
        description: "Você será redirecionado em alguns segundos.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err) {
      toast({
        title: "Erro!",
        description: "Usuário ou senha incorretos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit(onSubmit)();
      }
    };

    document.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChakraProvider>
      <Container
        centerContent
        minHeight="100vh"
        minWidth="full"
        justifyContent="center"
        alignItems="center"
      >
        <Box boxShadow="md" p="6" rounded="md" bg="white">
          <Center>
            <VStack h="full">
              <Heading as="h3" size="lg">
                Página de gestão
              </Heading>

              <Text>Faça login para continuar</Text>
            </VStack>
          </Center>

          <Divider my={5} />

          <VStack spacing={3}>
            <FormControl isInvalid={!!errors.username}>
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Usuário"
                {...register("username", {
                  required: {
                    value: true,
                    message: "Este campo é obrigatório.",
                  },
                })}
              />

              <FormErrorMessage>
                {String(errors?.username?.message)}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Senha"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Este campo é obrigatório.",
                    },
                  })}
                />

                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={togglePasswordVisibility}
                    variant="ghost"
                  >
                    {passwordVisible ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>
                {String(errors?.password?.message)}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </VStack>
        </Box>
      </Container>
    </ChakraProvider>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

import { useEffect, useState } from 'react'
import Head from 'next/head'

import { Box, ChakraProvider, CircularProgress, Container, Grid, StackDivider, VStack, Divider, useToast, HStack, Text, Tag } from '@chakra-ui/react'
import { IGuest } from '@/interfaces'
import { CreateInviteModal, DetailsModal, Header, InviteCard } from '../../modules/admin/components'
import { FILTERS_OPTIONS } from '../../modules/admin/constants'
import { Filters } from '../../modules/admin/interfaces'

interface IState {
  invites: Array<IGuest>
  total: number
  loading: boolean
  showDetails: boolean
  showNewInviteModal: boolean
  selectedInvite?: IGuest
  filters: Filters
}

const INITIAL_STATE: IState = {
  invites: [],
  total: 0,
  loading: true,
  showDetails: false,
  showNewInviteModal: false,
  selectedInvite: undefined,
  filters: [FILTERS_OPTIONS[0]],
}

export default function AdminLoginPage() {
  const toast = useToast()
  const [state, setState] = useState<IState>(INITIAL_STATE)

  async function getInvites() {
    const res = await fetch('/api/guest-list')
    const data = (await res.json()) satisfies Array<IGuest>
    setState({ ...state, invites: data, total: data.length, loading: false })
  }

  useEffect(() => {
    if (!state.showNewInviteModal) getInvites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.showNewInviteModal])

  function copyToClipboard(text: string) {
    const link = `${window.location.origin}/${text}`
    window.navigator.clipboard.writeText(link)

    toast({
      title: 'Link Copiado.',
      description: 'Link copiado para a área de transferência!',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  function openDetails(invite: IGuest) {
    setState({ ...state, showDetails: true, selectedInvite: invite })
  }

  function onNewInvite() {
    setState({ ...state, showDetails: false, selectedInvite: undefined, showNewInviteModal: true })
  }

  function setFilters(filters: Array<string>) {
    if (filters.includes('all') || filters.length === 0) return setState({ ...state, filters: [FILTERS_OPTIONS[0]] })

    const selectedFilters = FILTERS_OPTIONS.filter((filter) => filters.includes(filter.value))
    setState({ ...state, filters: selectedFilters })
  }

  function filterInvites() {
    const filters = {
      sent: (invite: IGuest) => invite.inviteSent,
      notSent: (invite: IGuest) => !invite.inviteSent,
      confirmed: (invite: IGuest) => invite.confirmed,
      notConfirmed: (invite: IGuest) => !invite.confirmed,
    }

    const filtersValues = state.filters.map((filter) => filter.value)

    const filterItems = () => {
      const filterKeys = state.filters.map((filter) => filter.value)

      return state.invites.filter((invite) => {
        return filterKeys.some((key) => filters[key as keyof typeof filters](invite))
      })
    }

    return filtersValues.includes('all') ? state.invites : filterItems()
  }

  function renderInvites() {
    const filteredInvites = filterInvites()

    return filteredInvites.map((invite, index) => {
      return <InviteCard key={index} invite={invite} copyToClipboard={copyToClipboard} openDetails={openDetails} />
    })
  }

  return (
    <ChakraProvider>
      <main>
        <Head>
          <title>Admin Page</title>
        </Head>

        <Container centerContent minHeight="100vh" minWidth="full">
          <Header onNewInviteClick={onNewInvite} onFilterClick={setFilters} />

          <Divider color="gray.200" />

          <HStack spacing={2} my={1}>
            <Text>{`Exibindo ${filterInvites().length} convites`}</Text>

            <Text> - </Text>

            <HStack spacing={2} my={1}>
              <Text>Filtros:</Text>

              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                  xl: 'repeat(4, 1fr)',
                }}
                gap={2}
              >
                {state.filters.map((filter, index) => (
                  <Tag key={index} size="sm" variant="subtle" colorScheme="red">
                    {filter.label}
                  </Tag>
                ))}
              </Grid>
            </HStack>
          </HStack>

          <Divider color="gray.200" />

          <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} h="full" w="full" align="center" justify="center">
            {state.loading && <CircularProgress isIndeterminate color="red.300" />}

            <Box w="full" p={4}>
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                  xl: 'repeat(4, 1fr)',
                }}
                gap={{
                  base: 2,
                  md: 4,
                  lg: 4,
                  xl: 4,
                }}
              >
                {renderInvites()}
              </Grid>
            </Box>
          </VStack>
        </Container>

        <DetailsModal isOpen={state.showDetails} onClose={() => setState({ ...state, showDetails: false })} invite={state.selectedInvite} />
        {state.showNewInviteModal && <CreateInviteModal isOpen={state.showNewInviteModal} onClose={() => setState({ ...state, showNewInviteModal: false })} />}
      </main>
    </ChakraProvider>
  )
}

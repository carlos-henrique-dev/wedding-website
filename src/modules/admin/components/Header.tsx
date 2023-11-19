import { AddIcon, ChevronDownIcon, HamburgerIcon, SearchIcon, UpDownIcon, ViewIcon } from '@chakra-ui/icons'
import { HStack, Button, Menu, MenuButton, MenuList, MenuItem, Divider, Text, CheckboxGroup, Checkbox, Input, Wrap, WrapItem, IconButton, Flex, Box, useDisclosure } from '@chakra-ui/react'
import { FILTERS_OPTIONS, GROUP_OPTIONS, SORT_OPTIONS } from '../constants'
import { ChangeEvent, useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { LogoutModal } from './logoutModal'

interface IHeaderProps {
  onNewInviteClick: () => void
  onShowReportsClick: () => void
  onFilterClick: (filter: Array<string>) => void
  onGroupClick: (group: Array<string> | undefined) => void
  onSortClick: (sorter: string | null) => void
  onSearchClick: (search: string) => void
}

export default function Header({ onNewInviteClick, onShowReportsClick, onFilterClick, onGroupClick, onSearchClick, onSortClick }: IHeaderProps) {
  const { data } = useSession()

  const { isOpen: showConfirmLogout, onOpen: onTryLogout, onClose: onCancelLogout } = useDisclosure()

  const [selectedFilters, setSelectedFilters] = useState<Array<string>>(['all'])
  const [selectedGroup, setSelectedGroup] = useState<Array<string> | undefined>()
  const [searchBarState, setSearchBarState] = useState<{ show: boolean; search: string }>({ show: false, search: '' })

  const handleCheckboxChange = (newValues: Array<string>) => {
    const newValuesWithoutAll = newValues.filter((value) => value !== 'all')

    setSelectedFilters(newValuesWithoutAll)
  }

  const handleGroupCheckboxChange = (newValues: Array<string>) => {
    const newSelectedGroup = newValues.filter((value) => !selectedGroup?.includes(value))

    setSelectedGroup(newSelectedGroup)
  }

  const handleSortCheckboxChange = (sortValue: string | null) => {
    onSortClick(sortValue)
  }

  const handleSelectAllFilters = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedFilters(['all'])
    }
  }

  useEffect(() => {
    onFilterClick(selectedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters])

  useEffect(() => {
    onGroupClick(selectedGroup)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup])

  const toggleSearchBar = () => {
    setSearchBarState({ show: !searchBarState.show, search: '' })
    onSearchClick('')
  }

  const searchInvite = (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.trim()

    setSearchBarState({ ...searchBarState, search })
  }

  const handleSearch = () => {
    onSearchClick(searchBarState.search)
  }

  return (
    <>
      <Flex width="full">
        <Box p={4}>
          <Menu>
            <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="outline" />

            <MenuList>
              <MenuItem>Usuário: {data?.user?.name}</MenuItem>

              <Divider />

              <MenuItem onClick={onShowReportsClick}>Relatório</MenuItem>

              <Divider />

              <MenuItem onClick={onTryLogout}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Box>

        <Box flex="1" w="full">
          <Text
            fontSize={{
              base: '2xl',
              md: '4xl',
              lg: '4xl',
              xl: '4xl',
            }}
            color="gray.500"
            textAlign="center"
            py={4}
          >
            Lista de convidados
          </Text>
        </Box>
      </Flex>

      <HStack w="full" justify="center" py={4} spacing={2}>
        <Wrap justify="space-evenly" align="center">
          <WrapItem>
            <Button
              size={{
                base: 'sm',
                md: 'md',
                lg: 'md',
                xl: 'md',
              }}
              colorScheme="green"
              onClick={onNewInviteClick}
            >
              Novo convite
            </Button>
          </WrapItem>

          <WrapItem>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                size={{
                  base: 'sm',
                  md: 'md',
                  lg: 'md',
                  xl: 'md',
                }}
                rightIcon={<ChevronDownIcon />}
              >
                Filtros
              </MenuButton>

              <MenuList>
                <CheckboxGroup colorScheme="red" value={selectedFilters} onChange={handleCheckboxChange}>
                  <MenuItem>
                    <Checkbox value={FILTERS_OPTIONS[0].value} onChange={handleSelectAllFilters}>
                      {FILTERS_OPTIONS[0].label}
                    </Checkbox>
                  </MenuItem>

                  <Divider color="gray.200" />

                  {FILTERS_OPTIONS.slice(1).map((filter, index) => (
                    <MenuItem key={index}>
                      <Checkbox key={index} value={filter.value}>
                        {filter.label}
                      </Checkbox>
                    </MenuItem>
                  ))}
                </CheckboxGroup>
              </MenuList>
            </Menu>
          </WrapItem>

          <WrapItem>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                size={{
                  base: 'sm',
                  md: 'md',
                  lg: 'md',
                  xl: 'md',
                }}
                rightIcon={<ChevronDownIcon />}
              >
                Grupo
              </MenuButton>

              <MenuList>
                <CheckboxGroup colorScheme="red" value={selectedGroup} onChange={handleGroupCheckboxChange}>
                  {GROUP_OPTIONS.map((filter, index) => (
                    <MenuItem key={index}>
                      <Checkbox key={index} value={filter.value}>
                        {filter.label}
                      </Checkbox>
                    </MenuItem>
                  ))}
                </CheckboxGroup>
              </MenuList>
            </Menu>
          </WrapItem>

          <WrapItem>
            <Menu>
              <MenuButton
                as={Button}
                size={{
                  base: 'sm',
                  md: 'md',
                  lg: 'md',
                  xl: 'md',
                }}
              >
                Ordenar
                <UpDownIcon ml={2} />
              </MenuButton>

              <MenuList>
                <MenuItem onClick={() => handleSortCheckboxChange(null)}>Sem ordenar</MenuItem>

                {SORT_OPTIONS.map((sorter, index) => (
                  <MenuItem key={index} onClick={() => handleSortCheckboxChange(sorter.value)}>
                    {sorter.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </WrapItem>

          <WrapItem mx={2}>
            <Button
              size={{
                base: 'sm',
                md: 'md',
                lg: 'md',
                xl: 'md',
              }}
              colorScheme="gray"
              onClick={toggleSearchBar}
              rightIcon={<SearchIcon w={4} h={4} cursor="pointer" />}
            >
              Pesquisa
            </Button>
          </WrapItem>

          {/* <WrapItem mx={2}>
            <Button
              size={{
                base: 'sm',
                md: 'md',
                lg: 'md',
                xl: 'md',
              }}
              colorScheme="blue"
              onClick={onShowReportsClick}
              rightIcon={<ViewIcon w={4} h={4} cursor="pointer" />}
            >
              Relatório
            </Button>
          </WrapItem> */}
        </Wrap>
      </HStack>

      {searchBarState.show && (
        <HStack w="full" spacing={1} my={2}>
          <Input
            placeholder="Pesquisar pelo nome da família ou membros"
            value={searchBarState.search}
            onChange={searchInvite}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch()
              }
            }}
          />

          <Button size="sm" onClick={handleSearch} disabled={searchBarState.search.trim() === ''} colorScheme="green">
            Buscar
          </Button>

          <Button size="sm" onClick={toggleSearchBar} colorScheme="red">
            Cancelar
          </Button>
        </HStack>
      )}

      {showConfirmLogout && <LogoutModal isOpen={showConfirmLogout} onClose={onCancelLogout} />}
    </>
  )
}

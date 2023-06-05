import { ChevronDownIcon, SearchIcon, ViewIcon } from '@chakra-ui/icons'
import { HStack, Button, Menu, MenuButton, MenuList, MenuItem, Divider, Text, CheckboxGroup, Checkbox, Input } from '@chakra-ui/react'
import { FILTERS_OPTIONS } from '../constants'
import { ChangeEvent, useEffect, useState } from 'react'

interface IHeaderProps {
  onNewInviteClick: () => void
  onShowReportsClick: () => void
  onFilterClick: (filter: Array<string>) => void
  onSearchClick: (search: string) => void
}

export default function Header({ onNewInviteClick, onShowReportsClick, onFilterClick, onSearchClick }: IHeaderProps) {
  const [selectedValues, setSelectedValues] = useState<Array<string>>(['all'])
  const [searchBarState, setSearchBarState] = useState<{ show: boolean; search: string }>({ show: false, search: '' })

  const handleCheckboxChange = (newValues: Array<string>) => {
    const newValuesWithoutAll = newValues.filter((value) => value !== 'all')

    setSelectedValues(newValuesWithoutAll)
  }

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedValues(['all'])
    }
  }

  useEffect(() => {
    onFilterClick(selectedValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues])

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
      <Text
        fontSize={{
          base: '2xl',
          md: '4xl',
          lg: '4xl',
          xl: '4xl',
        }}
        color="gray.500"
        py={4}
      >
        Lista de convidados
      </Text>

      <HStack w="full" justify="center" py={4} spacing={5}>
        <Button
          size={{
            base: 'sm',
            md: 'md',
            lg: 'md',
            xl: 'md',
          }}
          colorScheme="red"
          onClick={onNewInviteClick}
        >
          Novo convite
        </Button>

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
            <CheckboxGroup colorScheme="red" value={selectedValues} onChange={handleCheckboxChange}>
              <MenuItem>
                <Checkbox value={FILTERS_OPTIONS[0].value} onChange={handleSelectAll}>
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

        <SearchIcon w={6} h={6} color="blue.600" onClick={toggleSearchBar} cursor="pointer" />

        <ViewIcon w={6} h={6} color="green.600" onClick={onShowReportsClick} cursor="pointer" />
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
    </>
  )
}

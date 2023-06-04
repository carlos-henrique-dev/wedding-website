import { ChevronDownIcon } from '@chakra-ui/icons'
import { HStack, Button, Menu, MenuButton, MenuList, MenuItem, Divider, Text, CheckboxGroup, Checkbox } from '@chakra-ui/react'
import { FILTERS_OPTIONS } from '../constants'
import { ChangeEvent, useEffect, useState } from 'react'

interface IHeaderProps {
  onNewInviteClick: () => void
  onFilterClick: (filter: Array<string>) => void
}

export default function Header({ onNewInviteClick, onFilterClick }: IHeaderProps) {
  const [selectedValues, setSelectedValues] = useState<Array<string>>(['all'])

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

      <HStack w="full" justify="center" py={4}>
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
      </HStack>
    </>
  )
}

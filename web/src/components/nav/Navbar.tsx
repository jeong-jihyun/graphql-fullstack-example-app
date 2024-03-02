import { Box, Button, Flex, Link, Stack, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { ColorModeSwitcher } from '../../ColorModeSwitcher'

const Navbar = (): React.ReactElement => {
    return (
        <Box zIndex={10} position='fixed' w={'100%'} bg={useColorModeValue('white', 'gray.800')} borderBottom={1} borderStyle={'solid'} borderColor={useColorModeValue('gray.200', 'gray.700')} py={{ base: 2 }} px={{ base: 4 }}>
            <Flex maxW={960} color={useColorModeValue('gray.600', 'white')} minH={'60px'} align={'center'} m={'auto'}>
                <Flex flex={{ base: 1, md: 'auto' }}>
                    <Link as={RouterLink} to={'/'} fontFamily={'heading'} fontWeight={'bold'} color={useColorModeValue('gray.800', 'white')}> GhibliBestCut</Link>
                </Flex>
            </Flex>
            <Stack justify={'flex-end'} direction={'row'} spacing={6}>
                {/* 테마적용 start*/}
                <ColorModeSwitcher />
                {/* 테마적용 end*/}
                <Button fontSize={'small'} fontWeight={400} variant='link' as={RouterLink} to={'/login'}>로그인</Button>
                <Button display={{ base: 'none', md: 'inline-flex' }} fontSize={'small'} fontWeight={600} as={RouterLink} to='/singup' colorScheme='teal'>시작하기</Button>
            </Stack>
        </Box>
    )
}

export default Navbar
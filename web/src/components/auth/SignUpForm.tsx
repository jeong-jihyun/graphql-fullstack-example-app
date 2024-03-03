import { Box, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import SignUpRealForm from './SignUpRealForm'

const SignUpForm = (): React.ReactElement => {
    return (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
                <Heading fontSize={'4x1'}>계정생성</Heading>
                <Text fontSize={'large'} color={'gray.600'}>환영합니다.</Text>
            </Stack>
            <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                <SignUpRealForm />
            </Box>
        </Stack>
    )
}

export default SignUpForm
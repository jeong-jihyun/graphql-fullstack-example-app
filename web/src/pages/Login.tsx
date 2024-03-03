import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import CommonLayOut from '../components/CommonLayOut'
import LoginForm from '../components/auth/LoginForm'

const Login = (): React.ReactElement => {
    return (
        <Box bg={useColorModeValue('gray.50', 'gray.800')}>
            <CommonLayOut>
                <Flex align={'center'} justify={'center'}>
                    <LoginForm />
                </Flex>
            </CommonLayOut>
        </Box>
    )
}

export default Login
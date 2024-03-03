import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import CommonLayOut from '../components/CommonLayOut'
import SignUpForm from '../components/auth/SignUpForm'

const SignUp = (): React.ReactElement => {
    return (
        <Box bg={useColorModeValue('gray.50', 'gray.800')}>
            <CommonLayOut>
                <Flex align={'center'} justify={'center'}>
                    <SignUpForm />
                </Flex>
            </CommonLayOut>
        </Box>
    )
}

export default SignUp

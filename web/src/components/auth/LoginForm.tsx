import { Stack, Text } from '@chakra-ui/react'
import React from 'react'
import LoginRealForm from './LoginRealForm'

const LoginForm = (): React.ReactElement => {

    return (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} px={6} width={500}>
            <Stack fontSize={'4x1'}>지브리 명장면 프로젝트</Stack>
            <Text fontSize={'large'} color={'gray.600'}>
                감상평과 좋아요를 눌러보세요
            </Text>
            <LoginRealForm />
        </Stack>
    )
}

export default LoginForm

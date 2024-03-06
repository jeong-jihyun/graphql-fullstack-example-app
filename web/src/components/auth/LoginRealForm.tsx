import { Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form';
import { LoginMutationVariables, useLoginMutation } from '../../generated/graphql';
import { useNavigate } from 'react-router-dom';
/**
 * 로그인 요청
 * @returns 
 */
const LoginRealForm = (): React.ReactElement => {
    const history = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginMutationVariables>();
    const [login, { loading }] = useLoginMutation();
    const onSubmit = async (formData: LoginMutationVariables) => {
        const { data } = await login({ variables: formData });
        //console.log(data);
        if (data?.login.errors) {
            data.login.errors.forEach((err) => {
                //econsole.log(err.message)
                const field = 'loginInput.';
                setError((field + (err.field === "email" ? 'emailOrUsername' : err.field)) as Parameters<typeof setError>[0], {
                    message: err.message
                })
            })
        }

        if (data && data.login.accessToken) {
            localStorage.setItem('access_token', data.login.accessToken);
            history('/');
        }
    }
    return (
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
            <Stack as={'form'} spacing={4} onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={!!errors.loginInput?.emailOrUsername}>
                    <FormLabel>이메일 또는 아이디</FormLabel>
                    <Input type="emailOrUsername" placeholder='이메일 또는 아이디를 입력하세요'
                        {...register('loginInput.emailOrUsername', {
                            required: '이메일 또는 아이디를 입력해주세요'
                        })} />
                    <FormErrorMessage>
                        {errors.loginInput?.emailOrUsername && errors.loginInput.emailOrUsername.message}
                    </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.loginInput?.password}>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' placeholder='*********'
                        {...register('loginInput.password', { required: '암호를 입력해주세요' })} />
                    <FormErrorMessage>
                        {errors.loginInput?.password && errors.loginInput.password.message}
                    </FormErrorMessage>
                </FormControl>
                <Divider />
                <Button colorScheme='teal' type='submit' isLoading={loading}>로그인</Button>
            </Stack>
        </Box>
    )
}

export default LoginRealForm

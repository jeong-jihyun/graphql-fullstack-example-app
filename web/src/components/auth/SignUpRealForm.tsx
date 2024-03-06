import React from 'react'
import { SignUpMutationVariables, useSignUpMutation } from '../../generated/graphql'
import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
/**
 * 회원가입 요청
 * @returns 
 */
const SignUpRealForm = () => {
    // signup mutation hook call
    const [signUp, { loading }] = useSignUpMutation();
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpMutationVariables>();
    const history = useNavigate();
    const toast = useToast();

    const onSubmit = async (data: SignUpMutationVariables) => {
        const { signUpInput } = data;
        return signUp({ variables: { signUpInput } }).then((res) => {
            if (res.data?.signUp) {
                toast({ title: '회원가입을 환영합니다.', status: 'success' });
                history('/');
            } else {
                toast({ title: '회원가입 도중 문제가 발생했습니다.', status: 'error' })
            }
        }).catch((err) => {
            toast({ title: '이메일 또는 아이디가 중복됩니다.', status: 'error' });
            return err;
        })
    }

    return (
        <Stack as={'form'} spacing={4} width={400} onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.signUpInput?.email}>
                <FormLabel>이메일</FormLabel>
                <Input type='email' placeholder='example@example.com'
                    {...register('signUpInput.email', {
                        required: '이메일을 입력해주세요',
                        pattern: {
                            value: /^[a-zA-Z0-9+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: '이메일의 형식이 올바르지 않습니다.'
                        }
                    })} />
                <FormErrorMessage>
                    {errors.signUpInput?.email && errors.signUpInput.email.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.signUpInput?.username}>
                <FormLabel>아이디</FormLabel>
                <Input type='text' placeholder='example'
                    {...register('signUpInput.username', {
                        required: '아이디를 입력해주세요'
                    })} />
                <FormErrorMessage>
                    {errors.signUpInput?.username && errors.signUpInput.username.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.signUpInput?.password}>
                <FormLabel>암호</FormLabel>
                <Input type='password' placeholder='8자 이상의 영문, 숫자, 특수문자'
                    {...register('signUpInput.password', {
                        required: '암호를 입력해주세요',
                        min: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/,
                            message: '암호는 문자,숫자, 특수문자를 포함한 8자이어야 합니다.'
                        }
                    })} />
                <FormErrorMessage>
                    {errors.signUpInput?.password && errors.signUpInput.password.message}
                </FormErrorMessage>
            </FormControl>
            <Divider />
            <Button colorScheme='teal' type='submit' isLoading={loading}>계정생성</Button>
        </Stack>
    )
}

export default SignUpRealForm

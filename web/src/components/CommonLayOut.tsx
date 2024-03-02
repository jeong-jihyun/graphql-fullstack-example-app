import { BackgroundProps, Box } from '@chakra-ui/react';
import React from 'react'
import Navbar from './nav/Navbar';

interface CommonLayOutProps {
    children: React.ReactNode;
    bg?: BackgroundProps['bg'];
}

const CommonLayOut = ({ children, bg }: CommonLayOutProps) => {
    return (
        <div>
            {/* <Flex maxW={'960px'} justify={'center'}>
            </Flex> */}
            <Navbar />
            <Box px={{ base: 4 }} pt={24} mx={'auto'} maxW={'960px'} minH={'100vh'} w={'100%'} bg={bg}>
                {children}
            </Box>
        </div>
    )
}

export default CommonLayOut

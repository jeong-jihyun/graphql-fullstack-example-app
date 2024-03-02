import React from 'react'
import { FilmQuery } from '../../generated/graphql'
import { Box, Flex, Heading, Image, Tag, Text } from '@chakra-ui/react'

interface FilmDetailProps {
    film?: FilmQuery['film']
}

const FilmDetail = ({ film }: FilmDetailProps) => {
    return (
        <Flex mt={12} flexDirection={{ base: 'column', md: 'row' }}>
            <Box maxW={250} flex={1}>
                <Image src={film?.posterImg} borderRadius={20} />
            </Box>
            <Flex flex={1} ml={{ base: 0, md: 6 }} flexDirection={'column'} alignContent={'center'} justify={'flex-start'} alignItems={'flex-start'} >
                <Flex mt={2}>
                    {film?.genre.split(',').map((genre) => (<Tag key={genre} mr={2} size={'sm'}>{genre}</Tag>))}
                </Flex>
                <Heading mb={4} mt={2}>
                    {film?.title}
                    {film?.release ? `${new Date(film.release).getFullYear()}` : null}
                </Heading>
                <Heading size={'md'} mb={2}>
                    {film?.subtitle}
                </Heading>
                <Text mb={2}>
                    {film?.director.name}
                    {'ㆍ'}
                    {film && `${film.runningTime}분`}
                </Text>
                <Text fontSize={'small'}>{film?.description}</Text>
            </Flex>
        </Flex>
    )
}

export default FilmDetail

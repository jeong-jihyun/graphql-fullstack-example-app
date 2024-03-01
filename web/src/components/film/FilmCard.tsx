import { AspectRatio, Box, Image, Stack, Heading, useColorModeValue, Text } from '@chakra-ui/react';
import { FilmsQuery } from '../../graphql/queries/generated/graphql';

interface FilmCardProps {
    film: FilmsQuery['films']['films'][0];
}
export function FilmCard({ film }: FilmCardProps): React.ReactElement {
    return (
        <Box as="article" my={6} key={film.id}>
            <Box maxW="250px" w={'full'} pt={3} overflow={'hidden'}>
                <AspectRatio ratio={2 / 3}>
                    <Image src={film.posterImg} borderRadius='lg' />
                </AspectRatio>
            </Box>
            <Stack>
                <Heading color={useColorModeValue('gray.700', 'white')} fontSize={'xl'} fontFamily={'body'} mt={2}>
                    {film.title}
                </Heading>
                <Text fontSize={'small'}>{film.subtitle ? film.subtitle : (<> </>)}</Text>
            </Stack>
            <Stack spacing={0} fontSize={'small'} mt={2}>
                <Text as={'time'} dateTime={film.release} isTruncated color={'gray.500'}>
                    {`${film.release} ㆍ ${film.runningTime}분`}
                </Text>
                <Text isTruncated>{film.director.name}</Text>
            </Stack>
        </Box>
    );
}

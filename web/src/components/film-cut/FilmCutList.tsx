import React from 'react'
import { useCutsQuery } from '../../generated/graphql';
import { Box, Image, SimpleGrid, Spinner, LinkBox, LinkOverlay } from '@chakra-ui/react';
import LazyLoad from 'react-lazyload';

interface FilmCutListProps {
    filmId: number;
    onClick: (custId: number) => void;
}

const FilmCutList = ({ filmId, onClick }: FilmCutListProps): React.ReactElement => {
    const { data, loading } = useCutsQuery({ variables: { filmId } });
    if (loading) {
        return (
            <Box textAlign={'center'} my={10}>
                <Spinner />
            </Box>
        )
    }
    return (
        <SimpleGrid my={4} columns={[1, 2, null, 4]} spacing={[2, null, 8]}>
            {data?.cuts.map((cut) => (
                <LazyLoad height={200} once key={cut.id}>
                    <LinkBox as={'article'}>
                        <Box>
                            <LinkOverlay cursor={'pointer'} onClick={() => onClick(cut.id)}>
                                <Image src={cut.src} />
                            </LinkOverlay>
                        </Box>
                    </LinkBox>
                </LazyLoad>
            ))}
        </SimpleGrid>
    )
}

export default FilmCutList

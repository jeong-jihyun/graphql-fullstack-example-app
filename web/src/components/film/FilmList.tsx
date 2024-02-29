import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useFilmsQuery } from '../../generated/graphql';
import { FilmCard } from './FilmCard';
const FilmList = () => {
    const { data, loading, error } = useFilmsQuery();

    return (
        <>
            {error && (<p>{error.message}</p>)}
            <SimpleGrid columns={[2, null, 3]} spacing={[2, null, 10]}>
                {loading && new Array(6).fill(0).map((x) => <Skeleton key={x} height={'480px'} />)}
                {!loading && data && data.films.map((film) => (
                    <Box key={film.id}>
                        <FilmCard film={film} />
                    </Box>))}
            </SimpleGrid>
            {/* <pre>
                {JSON.stringify(data, null, 2)}
            </pre> */}
        </>
    )
}
export default FilmList
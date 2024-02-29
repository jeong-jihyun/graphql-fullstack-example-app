import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useFilmsQuery } from '../../generated/graphql';
import { FilmCard } from './FilmCard';
import { Waypoint } from 'react-waypoint';
const FilmList = () => {
    const LIMIT = 6;
    const { data, loading, error, fetchMore } = useFilmsQuery({
        variables: {
            limit: LIMIT,
            cursor: 1
        }
    });

    return (
        <>
            {error && (<p>{error.message}</p>)}
            <SimpleGrid columns={[2, null, 3]} spacing={[2, null, 10]}>
                {loading && new Array(6).fill(0).map((x, idx) => <Skeleton key={idx} height={'480px'} />)}
                {!loading && data && data.films.films.map((film, i) => (
                    <Box key={`box_${film.id}`}>
                        {data.films.cursor && i === data.films.films.length - LIMIT / 2 && (
                            <Waypoint onEnter={() => { fetchMore({ variables: { limit: LIMIT, cursor: data.films.cursor } }) }} />
                        )}
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
import { Spinner, Text } from '@chakra-ui/react'
import React from 'react'
import CommonLayOut from '../components/CommonLayOut'
import { useParams } from 'react-router-dom'
import { useFilmQuery } from '../generated/graphql'
import FilmDetail from '../components/film/FilmDetail'


const Film = (): React.ReactElement => {
    const { filmId } = useParams();

    const { data, loading, error } = useFilmQuery({
        variables: { filmId: Number(filmId) }
    })
    return (
        <CommonLayOut>
            {loading && <Spinner />}
            {error && <Text>페이지를 표시할수 없습니다.</Text>}
            {filmId && data?.film ? (<FilmDetail film={data?.film} />) : (<Text>페이지를 표시할 수 없습니다.</Text>)}
        </CommonLayOut>
    )
}

export default Film

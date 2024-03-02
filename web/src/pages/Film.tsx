import { Box, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import CommonLayOut from '../components/CommonLayOut'
import { useParams } from 'react-router-dom'
import { useFilmQuery } from '../generated/graphql'
import FilmDetail from '../components/film/FilmDetail'
import FilmCutList from '../components/film-cut/FilmCutList'
import FilmCutModal from '../components/film-cut/FilmCutModal'


const Film = (): React.ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { filmId } = useParams();
    const [selectedCutId, setSelectCutId] = useState<number>();
    const handleCutSelect = (cutId: number) => {
        setSelectCutId(cutId);
        onOpen();
    }
    const { data, loading, error } = useFilmQuery({
        variables: { filmId: Number(filmId) }
    })
    return (
        <CommonLayOut>
            {loading && <Spinner />}
            {error && <Text>페이지를 표시할수 없습니다.</Text>}
            {filmId && data?.film ? (
                <>
                    <FilmDetail film={data?.film} />
                    <Box mt={12}>
                        <FilmCutList filmId={data.film.id} onClick={handleCutSelect} />
                    </Box>
                </>
            ) : (<Text>페이지를 표시할 수 없습니다.</Text>)}
            {!selectedCutId ? null : (
                <FilmCutModal open={isOpen} onClose={onClose} cutId={selectedCutId} />
            )}
        </CommonLayOut>
    )
}

export default Film

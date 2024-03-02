import { Heading } from '@chakra-ui/react'
import React from 'react'
import FilmList from '../components/film/FilmList'
import CommonLayOut from '../components/CommonLayOut'

const Main = (): React.ReactElement => {
    return (
        <CommonLayOut>
            <Heading size="lg" mt={10}>애니메이션 목록</Heading>
            <FilmList />
        </CommonLayOut>
    )
}

export default Main

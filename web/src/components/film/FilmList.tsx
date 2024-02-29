import { gql, useQuery } from '@apollo/client'
interface Film {
    id: number;
    title: string;
    subtitle: string;
}
type FileQueryResult = { files: Film[] }
const FILM_QUERY = gql`
    query ExampleQuery{
        films{
            id
            title
            subtitle
        }
    }
`
const FilmList = () => {
    const { data, loading, error } = useQuery<FileQueryResult>(FILM_QUERY);
    return (
        <>
            {loading && (<p> ...loading</p>)}
            {error && (<p>{error.message}</p>)}
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </>
    )
}
export default FilmList

import { useFilmsQuery } from '../../generated/graphql';
const FilmList = () => {
    const { data, loading, error } = useFilmsQuery();

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

import { useState, useEffect } from 'react';

const useFetchPost = (url, postParam) => {
    const [data, setData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // console.log("useeffect log");
        // resolved the cross site issue through modification on the server side
        fetch(url, {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify(postParam)
        }).then(res => {
            if (!res.ok) {
                throw Error("Couldn't fetch data");
            }
            return res.json();
        }).then(data => {
            // console.log(data);
            setData(data);
            setIsDataLoading(false);
            setError(null);
        }).catch((e) => {
            console.log(e.message);
            setIsDataLoading(false);
            setError(e.message);

        })

    }, [url])//only render once, good for fetching data
    return { data, isDataLoading, error }
}

export default useFetchPost;
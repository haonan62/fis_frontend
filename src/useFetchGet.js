import {useState, useEffect} from 'react';

const useFetchGet=(url)=>{
    const [data, setData]=useState(null);
    const [isDataLoading, setIsDataLoading]=useState(true);
    const [error, setError]=useState(null);
    useEffect(()=>{
        console.log("useeffect log");
        // resolved the cross site issue through modification on the server side
        fetch(url).then(res=>{
            if(!res.ok){
                throw Error("Couldn't fetch freight data");
            }
            return res.json();
        }).then(data=>{
            console.log(data);
            setData(data);
            setIsDataLoading(false);
            setError(null);
        }).catch((e)=>{
            console.log(e.message);
            setIsDataLoading(false);
            setError(e.message);
            
        })

    },[url])//only render once, good for fetching data
    return {data, isDataLoading, error}
}

export default useFetchGet;
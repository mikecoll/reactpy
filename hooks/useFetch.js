import { useEffect, useState } from 'react';
import { get } from 'lodash';

const useFetch = (initalUrl) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState();
  const [url, setUrl] = useState(initalUrl);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      mounted && setIsError(false);
      mounted && setIsLoading(!!url);

      let result = null;

      try {
        result = await url;

        mounted && setData(result);
      } catch (error) {
        mounted && setIsError(error);
      } finally {
        mounted && setIsLoading(false);
      }

      // @NOTE: it is possable that an array of requests was provided
      if (get(result, 'status') >= 400) {
        mounted && setIsError(result);
      }
    };

    mounted && fetchData();

    return () => { mounted = false; };
  }, [url]);

  return [
    {
      data,
      isLoading,
      isError,
    },
    setUrl,
  ];
};

export default useFetch;

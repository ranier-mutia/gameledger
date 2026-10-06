import { useState, useEffect } from 'react';
import axios from 'axios';

const serverURL = import.meta.env.VITE_REACT_APP_SERVER_BASEURL;

// Module-level cache scoped specifically to IGDB reference data
let cachedIgdbMetadata = null;
let igdbMetadataPromise = null;

const getIgdbMetadata = async () => {
    if (cachedIgdbMetadata) {
      return cachedIgdbMetadata;
    }
  
    if (!igdbMetadataPromise) {
      igdbMetadataPromise = (async () => {
        try {
          const res = await axios.post(serverURL + 'games/getGameFilters');
          cachedIgdbMetadata = res.data;
          return cachedIgdbMetadata;
        } catch (err) {
          igdbMetadataPromise = null; // Reset on error so it can retry
          throw err;
        }
      })();
    }
  
    return igdbMetadataPromise;
  };

export function useGameFilters() {
  const [igdbFilters, setData] = useState(cachedIgdbMetadata);
  const [loading, setLoading] = useState(!cachedIgdbMetadata);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!cachedIgdbMetadata) {
      getIgdbMetadata()
        .then((result) => {
          if (isMounted) {
            setData(result);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message || 'Failed to load IGDB metadata');
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return { igdbFilters, loading, error };
}
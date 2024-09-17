// src/hooks/useUser.js

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const { loading, data, refetch } = useQuery(QUERY_ME);

  useEffect(() => {
    if (data && data.me) {
      setUser(data.me);
    }
  }, [data]);

  const refreshUser = async () => {
    const { data } = await refetch();
    if (data && data.me) {
      setUser(data.me);
    }
  };

  return { user, loading, refreshUser };
};
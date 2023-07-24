// import { useQuery } from 'react-query';
import axios from 'axios';
const baseUrl = '/api/users'

export const getUsersByQuery = async () => {
  const result = await axios.get(baseUrl)
  return result.data;
}
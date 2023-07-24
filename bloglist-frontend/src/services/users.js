// import { useQuery } from 'react-query';
import axios from 'axios';
const baseUrl = '/api/users'

export const getUsersByQuery = async () => {
  const result = await axios.get(baseUrl)
  return result.data;
}

export const getSingleUserByQuery = async ({ queryKey }) => {
  const [, username] = queryKey
  // console.log(queryKey)
  const result = await axios.get(`${baseUrl}/${username}`)
  console.log('Get singleQuery')
  console.log(result.data)
  return result.data;
}
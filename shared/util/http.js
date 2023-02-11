import axios from "axios";

const getInstance = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: typeof localStorage === 'undefined' ? undefined : {
      Authorization: `Basic ${Buffer.from(`${localStorage?.getItem('username')}:${localStorage?.getItem('password')}`).toString('base64')}`
    }
  });
}

let instance = getInstance();

export function reloadInstance() {
  instance = getInstance();
}

export default instance;

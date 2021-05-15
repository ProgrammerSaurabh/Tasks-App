import axios from "axios";
export default function putAxiosHelper(url, data) {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);

  return axios.put(url, data, {
    headers: {
      Authorization: "Bearer " + userToken?.token,
    },
  });
}

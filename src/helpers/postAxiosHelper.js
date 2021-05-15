import axios from "axios";
export default function postAxiosHelper(url, data) {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);

  return axios.post(url, data, {
    headers: {
      Authorization: "Bearer " + userToken?.token,
    },
  });
}

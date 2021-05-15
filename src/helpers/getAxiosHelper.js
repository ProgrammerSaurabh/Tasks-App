import axios from "axios";

export default function getAxiosHelper(url) {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return axios.get(url, {
    headers: {
      Authorization: "Bearer " + userToken?.token,
    },
  });
}

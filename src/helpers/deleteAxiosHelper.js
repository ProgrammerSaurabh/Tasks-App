import axios from "axios";

export default function deleteAxiosHelper(url) {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + userToken?.token,
    },
  });
}

import axios from "axios";

export const getUserApi = async () => {
  try {
    console.log("call api react");
    const res = await axios.get(`https://api.kristagram.com/api/v1/all`);
    console.log("****", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get user api", error);
  }
};

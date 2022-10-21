import axios from "axios";

export const getBrandApi = async (
  itemperpage,
  currentpageno,
  brand,
  status
) => {
  try {
    let st = `&status=${status}`;
    let url;
    if (status) {
      url = `/api/v1/all?itemperpage=${itemperpage}${st}&type_of_user=${brand}&currentpageno=${currentpageno}`;
    } else {
      url = `/api/v1/all?itemperpage=${itemperpage}&type_of_user=${brand}&currentpageno=${currentpageno}`;
    }

    console.log("getBrandApproveApi", itemperpage, currentpageno);
    const res = await axios.get(url);
    console.log("****", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get user api", error);
  }
};

export const getCountApi = async () => {
  try {
    console.log("getCountApi");
    const res = await axios.get(`/api/v1/all?itemperpage=10`);
    console.log("****", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get user api", error);
  }
};

import axios from "axios";

export const getBrandApproveApi = async () => {
  try {
    console.log("getBrandApproveApi");
    const res = await axios.get(
      `/api/v1/all?itemperpage=10&status=approved&type_of_user=brand`
    );
    console.log("****", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get user api", error);
  }
};

export const getBrandPendingApi = async () => {
  try {
    console.log("getBrandPendingApi");
    const res = await axios.get(
      `/api/v1/all?itemperpage=10&status=pending&type_of_user=brand`
    );
    console.log("****", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get user api", error);
  }
};

export const getBrandSuspendApi = async () => {
  try {
    console.log("getBrandSuspendApi");
    const res = await axios.get(
      `/api/v1/all?itemperpage=10&status=suspend&type_of_user=brand`
    );
    console.log("****", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get user api", error);
  }
};

export const getBrandAllApi = async () => {
  try {
    console.log("getBrandAllApi");
    const res = await axios.get(
      `/api/v1/all?itemperpage=10&type_of_user=brand`
    );
    console.log("****", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get user api", error);
  }
};

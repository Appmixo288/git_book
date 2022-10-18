import axios from "axios";

const URL = "http://localhost:4000";

export const getUserApi = async () => {
    try {
      console.log('call api react')
        const res=await axios.get(`https://kristagram.appmixo.com/api/v1/all`);
        console.log('****',res.data.user[0].phone)
        console.log('data',res.data.user[0].createdAt)
        console.log('data',res.data.user[0].phone)
        console.log('data',res.data.user[0].status)
        console.log('data',res.data.user[0].type_of_user)
        console.log('data',res.data.user[0]._id)
        console.log('data',res.data.user[0].updatedAt)
        console.log('data',res.data.user[0].brands.createdAt)
        console.log('data',res.data.user[0].brands.type_of_brand)
        console.log('data',res.data.user[0].brands.user_id)
        console.log('data',res.data.user[0].brands.updatedAt)
        console.log('data',res.data.user[0].brands._id)

       return res;
    } catch (error) {
      console.log("error while calling get user api", error);
    }
  };
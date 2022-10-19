
import mongoose from "mongoose"

import adminUser from "../models/userModel.js"

import errors from "../utils/errors.js"


//@Router router.route("/verifyuser").put(VerifyUser);
//verify user panding approved and reject
export const VerifyUser = async (req, res, next) => {
  try {
    const { userId, status } = req.body;
    let statusCase = status.toLowerCase();
    let is_update;
    let brand_update_time;

    if (!status || !userId) {
      return res.status(400).json(errors.MANDATORY_FIELDS);
    }
    if (statusCase === "suspended") {
      is_update = true;
    }
    if (statusCase === "approved") {
      is_update = true;
    }
    if (statusCase === "pending") {
      is_update = false;
    }
    if (req.user.is_admin === true) {
      const user = await adminUser.findById({ _id: userId });
      if (!user) {
        return res.status(400).json(errors.INVALID_FIELDS);
      }
      const userDate = await adminUser.findByIdAndUpdate(
        userId,
        { status: statusCase, is_update },
        {
          new: true,
          runValidators: true,
        }
      );
      const users = await userDetails({ _id: mongoose.Types.ObjectId(userId) });

      return res.status(200).json({
        success: true,
        user: users[0],
      });
      
    } else {
      return res.status(400).json({
        success: false,
        message: "Admin User Access. ",
      });
    }
  } catch (error) {
    console.log("error", error);
    if (error instanceof mongoose.Error.ValidationError) {
      for (let field in error.errors) {
        return res.status(500).json({
          success: false,
          message: error.errors[field].message,
        });
      }
    }
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/adminuser").put(userAdmin);
//admin user create.
export const userAdmin = async (req, res, next) => {
  try {
    const { isAdmin, userId } = req.body;

    if (isAdmin == null || !userId) {
      return res.status(400).json(errors.MANDATORY_FIELDS);
    }

    const user = await adminUser.findById({ _id: userId });
    if (!user) {
      return res.status(400).json(errors.INVALID_FIELDS);
    }

    data = await adminUser.findByIdAndUpdate(
      { _id: userId },
      { $set: { is_admin: isAdmin } },
      {
        new: true,
      }
    );
    return res.status(201).json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/savecost").post(isAuthentication,saveCost);
// save cost userwise and if user status= approved then after 15 day update a cost,tag


//time remaning
function dhm(ms) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000);
  //  return days + ":" + hours + ":" + minutes + ":" + sec;
  return days.toString();
}

//user response
async function userDetails(userPara = {}, search = null, type = null) {
  // console.log('userPara',userPara)
  const query = [
    {
      $lookup: {
        from: "costs",
        localField: "_id",
        foreignField: "user_id",
        as: "costs",
      },
    },
    {
      $unwind: {
        path: "$costs",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "brandinfos",
        localField: "_id",
        foreignField: "user_id",
        as: "brands",
      },
    },
    {
      $unwind: {
        path: "$brands",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: userPara,
    },
  ];

  // console.log("query", JSON.stringify(query, null, 2));
  let users = await adminUser.aggregate(query);
  //  await User.populate(users,{path:"following",select: { 'followers': 0,'following':0}})
  //  await User.populate(users,{path:"followers",select: { 'followers': 0,'following':0}})

  //{ "instagram_info.name": "eeee Tass p" },
  // , match: { $or:[{ "instagram_info.name": "rrr" },{"brands.tags[0].name":"wwwww"}]}  { $in :{"brands.tag.name":"eeee"} }
  //$or:[{ "instagram_info.name": "rrr" },

  //search
  let cond;
  if (search && type) {
    cond = {
      $and: [{ type_of_user: type }],
      $or: [
        { "instagram_info.name": search },
        { "facebook_info.name": search },
        { phone: "+" + search },
      ],
    };
  } else if (type) {
    cond = { $and: [{ type_of_user: type }] };
  } else if (search) {
    cond = {
      $or: [
        { "instagram_info.name": search },
        { "facebook_info.name": search },
        { phone: "+" + search },
      ],
    };
  } else {
    cond = {};
  }

  let data = await adminUser.populate(users, {
    path: "following",
    select: { followers: 0, following: 0 },
    match: cond,
  });
  data = await adminUser.populate(users, {
    path: "followers",
    select: { followers: 0, following: 0 },
  });
  for (let element of data) {
    arr_following = element?.following;
    if (arr_following != undefined) {
      var user_following;
      var users_arr = [];

      for (let e of arr_following) {
        user_following = await connectDetails({
          _id: mongoose.Types.ObjectId(e._id),
        });
        users_arr.push(user_following[0]);
      }
      element.following = users_arr;
    }

    arr_followers = element?.followers;
    if (arr_followers != undefined) {
      var user_followers;
      var user_arr = [];

      for (let e of arr_followers) {
        user_followers = await connectDetails({
          _id: mongoose.Types.ObjectId(e._id),
        });
        user_arr.push(user_followers[0]);
      }
      element.followers = user_arr;
    }
  }

  users = await responseCostBrand(users);

  return users;
}

async function connectDetails(userPara) {
  const query = [
    {
      $lookup: {
        from: "costs",
        localField: "_id",
        foreignField: "user_id",
        as: "costs",
      },
    },
    {
      $unwind: {
        path: "$costs",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "brandinfos",
        localField: "_id",
        foreignField: "user_id",
        as: "brands",
      },
    },
    {
      $unwind: {
        path: "$brands",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: userPara,
    },
    {
      $project: {
        followers: 0,
        following: 0,
        token: 0,
      },
    },
  ];

  // console.log("query", JSON.stringify(query, null, 2));
  let users = await adminUser.aggregate(query);

  //  await User.populate(users,{path:"following",select: { 'followers': 0,'following':0}})
  //  await User.populate(users,{path:"followers",select: { 'followers': 0,'following':0}})
  users = await responseCostBrand(users);
  return users;
}

const responseCostBrand = async (users) => {
  for (const e of users) {
    if (e.profile_image) {
      e.profile_image = process.env.AWS_S3_BASE_URL + e.profile_image;
    }

    if (e.thumbnail_image) {
      e.thumbnail_image = process.env.AWS_S3_BASE_URL + e.thumbnail_image;
    }

    if (e.cover_image) {
      e.cover_image = process.env.AWS_S3_BASE_URL + e.cover_image;
    }

    e.tags = e?.costs?.tag || e?.brands?.tag;

    if (e?.cost_update_time && e?.status === "approved") {
      let timeDay = dhm(
        new Date(e?.cost_update_time).getTime() + 1296000000 - Date.now()
      );
      e.time_remaining = timeDay <= 0 ? "0" : timeDay;
      e.is_update = true;
      if (parseInt(e?.time_remaining) <= 0) {
        e.is_update = false;
        // await updateTimedate({is_update:false},e._id)
      }
    }
    //     else{
    //       e.is_update=true
    //      // await updateTimedate({is_update:true},e._id)
    //   }
    // }else if (e?.status == "pending"){
    //   e.is_update=false
    //   //await updateTimedate({is_update:false},e._id)
    // }

    if (e?.brand_update_time && e?.status === "approved") {
      let timeDay = dhm(
        new Date(e?.brand_update_time).getTime() + 1296000000 - Date.now()
      );
      e.is_update = true;
      e.time_remaining = timeDay <= 0 ? "0" : timeDay;
      if (parseInt(e?.time_remaining) <= 0) {
        e.is_update = false;
        await updateTimedate({ is_update: false }, e._id);
      }
      // else{
      // console.log("2")
      // e.is_update=true
      //await updateTimedate({is_update:true},e._id)
      // }
      // }else if (e?.status === "pending" ){
      //   console.log("3")
      //  e.is_update=false
      //await updateTimedate({is_update:false},e._id)
    }

    delete e?.brands?.tag;
    delete e?.costs?.tag;
  }

  return users;
};

const updateTimedate = async (updateTime, id) => {
  // console.log("updateTimedate",updateTime, id)
  const data = await adminUser.findByIdAndUpdate(
    { _id: id },
    { $set: updateTime },
    {
      new: true,
    }
  );
};

//@Router router.route("/allusers").get(getuserDetails)
//all User Details
export const getuserDetails = async (req, res, next) => {
  try {
    const facebook = req.query.isfacebook === "true";
    const instagram = req.query.isInstagram === "true";
    let searchdata = req.query.search;
    const phone = req.query.phone || searchdata;
    const facebookname = req.query.facebook_name || searchdata;
    const instagramname = req.query.instagram_name || searchdata;
    const business_name = searchdata;

    let tag = req.query.tag || searchdata;
    let query = "";

    const verify = req.query.status;
    const type = req.query.type_of_user;
    const id = req.query._id;

    let transactionType = req.query.transactiontype;
    // let costQuery = [];
    const admin = req.query.isadmin === "true";

    //pagination
    let currpage, itempage;
   
    const itemperpage =  req.query.itemperpage || process.env.PAGE_LIMIT;
    const currentpageno = req.query.currentpageno || 1;

    const andQuery = [];
    const faceQuery = [];
    if (req.query.isfacebook) {
      andQuery.push({
        is_facebook: facebook,
      });
    }

    if (req.query.isInstagram) {
      andQuery.push({
        is_instagram: instagram,
      });
    }

    if (phone) {
      faceQuery.push({
        phone: { $regex: "^\\+" + phone, $options: "i" },
      });
    }

    if (searchdata) {
      faceQuery.push({
        first_name: { $regex: "^" + searchdata, $options: "i" },
      });
      faceQuery.push({
        last_name: { $regex: "^" + searchdata, $options: "i" },
      });
    }

    if (facebookname) {
      faceQuery.push({
        "facebook_info.name": { $regex: "^" + facebookname, $options: "i" },
      });
    }

    if (instagramname) {
      faceQuery.push({
        "instagram_info.name": { $regex: "^" + instagramname, $options: "i" },
      });
    }

    if (id) {
      andQuery.push({
        _id: mongoose.Types.ObjectId(id),
      });
    }

    if (verify) {
      andQuery.push({
        status: verify,
      });
    }

    if (type) {
      andQuery.push({
        type_of_user: type,
      });
    }

    if (req.query.isadmin) {
      andQuery.push({
        is_admin: admin,
      });
    }

    if (transactionType) {
      andQuery.push({
        "costs.transaction_type": transactionType,
      });
    }

    if (tag) {
      faceQuery.push({
        "costs.tag.name": {
          $regex: "^" + tag,
          $options: "i",
        },
      });
      faceQuery.push({
        "brands.tag.name": {
          $regex: "^" + tag,
          $options: "i",
        },
      });
    }

    if (business_name) {
      faceQuery.push({
        "brands.business_name": { $regex: "^" + business_name, $options: "i" },
      });
    }

    if (currentpageno && itemperpage) {
      currpage = itemperpage * currentpageno - itemperpage;
    }

    if (currentpageno && itemperpage) {
      itempage = parseInt(itemperpage);
    }

    let arrData;
    if (faceQuery.length > 0 && andQuery.length > 0) {
      arrData = {
        $and: andQuery,
        $or: faceQuery,
      };
    } else if (andQuery.length > 0) {
      arrData = {
        $and: andQuery,
      };
    } else if (faceQuery.length > 0) {
      arrData = {
        $or: faceQuery,
      };
    } else {
      arrData = {};
    }

    // let arr;
    // if (costQuery.length > 0) {
    //   arr = {
    //     $and: costQuery,
    //   };
    // } else {
    //   arr = {};
    // }

    query = [
      {
        $lookup: {
          from: "costs",
          localField: "_id",
          foreignField: "user_id",
          as: "costs",
        },
      },
      {
        $unwind: {
          path: "$costs",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "brandinfos",
          localField: "_id",
          foreignField: "user_id",
          as: "brands",
        },
      },
      {
        $unwind: {
          path: "$brands",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: arrData,
      },
      // {
      //   $match: arr,
      // },
      {
        $project: {
          followers: 0,
          following: 0,
          token: 0,
        },
      },
      {
        $skip: currpage,
      },
      {
        $limit: itempage,
      },
      { 
        $sort : { createdAt : -1 }
       }
    ];
   
    //  console.log("query",JSON.stringify(query,2,null))
    let users = await adminUser.aggregate(query);
    //  users = await responseCostBrand(users);
    // for (const e of users) {
    //   if (e.profile_image) {
    //     e.profile_image = process.env.AWS_S3_BASE_URL + e.profile_image;
    //   }
  
    //   if (e.thumbnail_image) {
    //     e.thumbnail_image = process.env.AWS_S3_BASE_URL + e.thumbnail_image;
    //   }
  
    //   if (e.cover_image) {
    //     e.cover_image = process.env.AWS_S3_BASE_URL + e.cover_image;
    //   }
  
    //   e.tags = e?.costs?.tag || e?.brands?.tag;
    //   delete e?.brands?.tag;
    //   delete e?.costs?.tag;
    // }
  
    // return users;

    // users = await User.populate(usersdata,{path:"followers"})
    //  let  users = await User.populate(users1,{path:"followers"})
    // users = await responseCostBrand(users);
    //  console.log("time",new Date().getMilliseconds())
    for (const e of users) {
      if (e.profile_image) {
        e.profile_image = process.env.AWS_S3_BASE_URL + e.profile_image;
      }
  
      if (e.thumbnail_image) {
        e.thumbnail_image = process.env.AWS_S3_BASE_URL + e.thumbnail_image;
      }
  
      if (e.cover_image) {
        e.cover_image = process.env.AWS_S3_BASE_URL + e.cover_image;
      }
  
      e.tags = e?.costs?.tag || e?.brands?.tag;
      delete e?.brands?.tag;
      delete e?.costs?.tag;
      // return users
    }
  
    // return users;
    return res.status(200).json({
      success: true,
      user: users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const admingetuserDetails = async (req, res, next) => {
  try {
    const facebook = req.query.isfacebook === "true";
    const instagram = req.query.isInstagram === "true";
    let searchdata = req.query.search;
    const phone = req.query.phone || searchdata;
    const facebookname = req.query.facebook_name || searchdata;
    const instagramname = req.query.instagram_name || searchdata;
    let tag = req.query.tag || searchdata;
    const business_name = searchdata;
    let query = "";

    const verify = req.query.status;
    const type = req.query.type_of_user;
    const id = req.query._id;
    let transactionType = req.query.transactiontype;
    // let costQuery = [];
    // let tagdata ={};
    const admin = req.query.isadmin === "true";

    //pagination
    let currpage, itempage;
    const itemperpage = req.query.itemperpage ||10
    const currentpageno = req.query.currentpageno || 1;

    if(Object.entries(req.query).length > 0){
    const andQuery = [];
    const faceQuery = [];
    if (req.query.isfacebook) {
      andQuery.push({
        is_facebook: facebook,
      });
    }

    if (req.query.isInstagram) {
      andQuery.push({
        is_instagram: instagram,
      });
    }

    if (phone) {
      faceQuery.push({
        phone: { $regex: "^\\+" + phone, $options: "i" },
      });
    }

    if (searchdata) {
      faceQuery.push({
        first_name: { $regex: "^" + searchdata, $options: "i" },
      });
      faceQuery.push({
        last_name: { $regex: "^" + searchdata, $options: "i" },
      });
    }


    if (facebookname) {
      faceQuery.push({
        "facebook_info.name": { $regex: "^" + facebookname, $options: "i" },
      });
    }

    if (instagramname) {
      faceQuery.push({
        "instagram_info.name": { $regex: "^" + instagramname, $options: "i" },
      });
    }

    if (id) {
      andQuery.push({
        _id: mongoose.Types.ObjectId(id),
      });
    }
    if (verify) {
      andQuery.push({
        status: verify,
      });
    }
    if (type) {
      andQuery.push({
        type_of_user: type,
      });
    }
    if (req.query.isadmin) {
      andQuery.push({
        is_admin: admin,
      });
    }

    if (transactionType) {
      andQuery.push({
        "costs.transaction_type": transactionType,
      });
    }

    if (tag) {
      faceQuery.push({
        "costs.tag.name": {
          $regex: "^" + tag,
          $options: "i",
        },
      });

      faceQuery.push({
        "brands.tag.name": {
          $regex: "^" + tag,
          $options: "i",
        },
      });
    }

    if (business_name) {
      faceQuery.push({
        "brands.business_name": { $regex: "^" + business_name, $options: "i" },
      });
    }

    if (currentpageno && itemperpage) {
      currpage = itemperpage * currentpageno - itemperpage;
    }

    if (currentpageno && itemperpage) {
      itempage = parseInt(itemperpage);
    }

    let arrData;
    if (faceQuery.length > 0 && andQuery.length > 0) {
      arrData = {
        $and: andQuery,
        $or: faceQuery,
      };
    } else if (andQuery.length > 0) {
      arrData = {
        $and: andQuery,
      };
    } else if (faceQuery.length > 0) {
      arrData = {
        $or: faceQuery,
      };
    } else {
      arrData = {};
    }

    // let arrData;
    // if (andQuery.length > 0) {
    //   arrData = {
    //     $and: andQuery,
    //   };
    // }else {
    //   arrData = {};
    // }

    // let arr;
    // if (costQuery.length > 0) {
    //   arr = {
    //     $and: costQuery,
    //   };
    // } else {
    //   arr = {};
    // }

    query = [
      {
        $lookup: {
          from: "costs",
          localField: "_id",
          foreignField: "user_id",
          as: "costs",
        },
      },
      {
        $unwind: {
          path: "$costs",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "brandinfos",
          localField: "_id",
          foreignField: "user_id",
          as: "brands",
        },
      },
      {
        $unwind: {
          path: "$brands",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: arrData,
      },
      // {
      //   $match: arr,
      // },
      {
        $project: {
          followers: 0,
          following: 0,
          token: 0,
        },
      },
      // {
      //   $count:'phone'
      // },
      // {
      //   $skip: currpage,
      // },
      // {
      //   $limit: itempage,
      // },
      { 
        $sort : { createdAt : -1 }
      }
    ];
    // console.log("query",JSON.stringify(query,2,null))
    query.push({
      $match: {},
    });

    let total_records = await adminUser.aggregate(query)

    console.log("total_records",total_records.length);

    let aggregateArrayWithPagination = query.concat([
      { $skip: currpage },
      { $limit: itempage },
    ]);

    
    let users = await adminUser.aggregate(aggregateArrayWithPagination);
    //  data =await User.populate(users,{path:"following",select: { 'followers': 0,'following':0}})
    //  data= await User.populate(users,{path:"followers",select: { 'followers': 0,'following':0}})

    // for (let element of data) {
    //   // console.log("element11111",element?.following)
    //    arr_following=element?.following

    //    if(arr_following != undefined){
    //     var user_following
    //     var users_arr =[]
    //     for(let e of arr_following){
    //       // console.log("ff",e._id)
    //       user_following = await connectDetails({_id:mongoose.Types.ObjectId(e._id)})
    //       //  if(e._id)
    //       users_arr.push(user_following[0])
    //      }
    //      element.following =users_arr
    //    }

    //    arr_followers= element?.followers
    //    if(arr_followers != undefined){
    //     var user_followers
    //     var user_arr =[]
    //     for(let e of arr_followers){
    //       // console.log("ff",e._id)
    //       user_followers = await connectDetails({_id:mongoose.Types.ObjectId(e._id)})
    //       //  if(e._id)
    //       user_arr.push(user_followers[0])
    //      }
    //      element.followers =user_arr
    //    }
    // }

    // users = await User.populate(usersdata,{path:"followers"})
    //  let  users = await User.populate(users1,{path:"followers"})

    users = await responseCostBrand(users);

    return res.status(200).json({
      success: true,
      user: users,
      total_records:total_records.length
    });
  }else{
    return res.status(200).json({
      success: true,
      message: "Invalid request ",
    });
  }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/me").get(isAuthentication,getuser);
//get login user details
export const getuser = async (req, res, next) => {
  try {
    const search = req.query.search;
    const type = req.query.type_of_user;
    const users = await userDetails(
      { _id: mongoose.Types.ObjectId(req.user.id) },
      search,
      type
    );
  
      return res.status(201).json({
        success: true,
        user: users[0],
        
      });
      
    
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/deleteme").delete(isAuthentication,deleteUser)
//delete User
// exports.deleteUser = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     //userid wise all table record delete
//     const user = await User.findByIdAndDelete({ _id: userId });
//     const costs = await Cost.deleteOne({ user_id: userId });
//     const brands = await BrandInfo.deleteOne({ user_id: userId });
//     // const tags = await Tag.deleteMany({ user_id: userId });

//     // const allUser = await User.find()

//     // allUser.forEach(ele => {
//     //   if (ele?.followers.lenght > 0){
//     //     console.log("1")
//     //   ele?.followers?.filter((e)=>{
//     //     console.log("e followers",followers)
//     //     if(e?.toString() == user_id){
//     //       console.log(user_id)
//     //       e.remove(user_id)
//     //     }
//     //   })
//     // }
//     // });

//     // allUser.forEach(ele => {
//     //   ele?.following?.filter((e)=>{
//     //     console.log("e following",e)
//     //     if(e?.toString() == user_id){
//     //       console.log(user_id)
//     //       e.remove(user_id)
//     //     }
//     //   })
//     // });

//     return res.status(200).json({
//       success: true,
//       message: "Delete successfully",
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };

//@Router router.route("/deleteadminuser").delete(isAuthentication,deleteadminUser);
//admin delete user
// exports.deleteadminUser = async (req, res, next) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json(errors.MANDATORY_FIELDS);
//     }

//     const adminId = req.user.is_admin;
//     if (adminId == true) {
//       const userData = await User.findById({ _id: userId });
//       if (!userData) {
//         return res.status(400).json(errors.INVALID_FIELDS);
//       }

//       //userid wise all table record delete
//       const user = await User.findByIdAndDelete({ _id: userId });
//       const costs = await Cost.deleteOne({ user_id: userId });
//       const brands = await BrandInfo.deleteOne({ user_id: userId });

//       // const tags = await Tag.deleteMany({ user_id: userId });
//       return res.status(201).json({
//         success: true,
//         message: "Delete successfully.",
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Only admin can delete user... ",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };



// admin update user details
// exports.adminUpdateUserDetails = async (req, res, next) => {
//   try {
//     console.log("time",new Date().getTime())
//     let cost_update_time, is_update, brand_update_time;
//     // status
//     const {
//       user_id,
//       type_of_user,
//       first_name,
//       last_name,
//       facebook_username,
//       instagram_username,
//       youtube_username,
//       youtube_followers,
//       instagram_followers,
//       facebook_followers,
//       is_admin,
//       cost,
//       transaction_type,
//       tag,
//       address,
//       city,
//       state,
//       country,
//       business_name,
//       store_website,
//       type_of_brand,
//     } = req.body;

//     let tran_type = transaction_type && transaction_type.toLowerCase();
//     console.log("tran_type", tran_type);
//     let user_type = type_of_user && type_of_user.toLowerCase();
//     let brand_type = type_of_brand && type_of_brand.toLowerCase();
//     // let user_status = status&&status.toLowerCase()

//     if (req.user.is_admin === true) {
//       if (!user_id) {
//         return res.status(400).json(errors.MANDATORY_FIELDS);
//       }

//       // if(user_status){
//       //   if(user_status == "approved") {is_update=false}
//       //   if(user_status == "suspended") {is_update=true}
//       //   cost_update_time = 0
//       //   brand_update_time = 0
//       // }

//       const user = await User.findById({ _id: user_id });
//       const brand = await BrandInfo.find({ user_id });
//       // console.log("11111111",brand, brand.length === 0 && ( user_type === "brand" || ( user_type === "brand" && user.type_of_user === undefined)))
//       // if(user.type_of_user === "influencer" && type_of_user === "brand" || ( type_of_user === "influencer" || user.type_of_user === undefined) ){
//       if (
//         brand.length === 0 &&
//         (user_type === "brand" ||
//           (user_type === "brand" && user.type_of_user === undefined))
//       ) {
//         const cost = await Cost.deleteOne({ user_id: user.id });
//         if (!brand_type) {
//           return res.status(400).json(errors.MANDATORY_FIELDS);
//         }
//         const brand = await BrandInfo.create({
//           user_id,
//           type_of_brand: brand_type,
//         });
//         cost_update_time = 0;
//         is_update = false;
//       }

//       const costdata = await Cost.find({ user_id: user_id });
//       // console.log("2222",costdata, costdata.length === 0 &&  (user_type === "influencer" || ( user_type === "influencer" && user.type_of_user === undefined)))
//       // if((user.type_of_user === "brand" && type_of_user === "influencer" )|| (user.type_of_user === undefined || user.type_of_user === "influencer" && type_of_user === "influencer")){
//       if (
//         costdata.length === 0 &&
//         (user_type === "influencer" ||
//           (user_type === "influencer" && user.type_of_user === undefined))
//       ) {
//         const brand = await BrandInfo.deleteOne({ user_id: user.id });
//         const cost = await Cost.create({
//           user_id: user.id,
//         });
//         brand_update_time = 0;
//         is_update = false;
//       }

//       //,status:user_status
//       const userUpdate = await User.findByIdAndUpdate(
//         { _id: user_id },
//         {
//           $set: {
//             type_of_user: user_type,
//             is_admin,
//             cost_update_time,
//             is_update,
//             brand_update_time,
//             first_name,
//             last_name,
//             facebook_username,
//             instagram_username,
//             youtube_username,
//             youtube_followers,
//             instagram_followers,
//             facebook_followers,
//             "instagram_info.instagram_followers": instagram_followers,
//             "facebook_info.facebook_followers": facebook_followers,
//           },
//         },
//         {
//           new: true,
//         }
//       );

//       const costUpdate = await Cost.findOneAndUpdate(
//         { user_id: user_id },
//         { $set: { cost, transaction_type: tran_type, tag } },
//         {
//           new: true,
//         }
//       );

//       const brandUpdate = await BrandInfo.findOneAndUpdate(
//         { user_id: user_id },
//         {
//           $set: {
//             tag,
//             business_name,
//             address,
//             city,
//             state,
//             country,
//             store_website,
//             type_of_brand: brand_type,
//           },
//         },
//         {
//           new: true,
//         }
//       );
//       console.log("time",new Date().getTime())
//       const users = await userDetails({
//         _id: mongoose.Types.ObjectId(user_id),
//       });
//       console.log("time",new Date().getTime())
//       return res.status(200).json({
//         success: true,
//         user: users[0],
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: " Only admin can edit user details.",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };

//@Router router.route("/me").get(isAuthentication,getuser);
//get login user details
// exports.admingetuser = async (req, res, next) => {
//   try {
//     const { user_id } = req.body;
//     if (req.user.is_admin === true) {
//       if (!user_id) {
//         return res.status(400).json(errors.MANDATORY_FIELDS);
//       }
//       const users = await userDetails({
//         _id: mongoose.Types.ObjectId(user_id),
//       });
//       return res.status(201).json({
//         success: true,
//         user: users[0],
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: " Only admin can get user details.",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };



// const uploadFile = (data, name) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const key = `secure/kristagram/${name}.jpg`;

//       //covert base64 to buffer
//       const buffer = Buffer.from(data, "base64");

//       const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: key, // File name you want to save as in S3
//         Body: buffer, // passed buffer data
//         ACL: "public-read",
//         region: process.env.AWS_S3_REGION,
//         ContentEncoding: "base64",
//         ContentType: `image/jpeg`,
//       };

//       // Uploading files to the bucket
//       s3.upload(params, function (err, data) {
//         if (err) {
//           return reject(err);
//         }
//         var path = data.Key;

//         resolve(path);
//       });
//     } catch (error) {
//       console.log("error", error);
//       return reject(error);
//     }
//   });
// };



// exports.adminProfileCoverimage = async (req, res, next) => {
//   try {
//     if (req.user.is_admin === true) {
//       const { user_id } = req.body;

//       var datetime = new Date().getTime();
//       let filePath, thumbnailfile, coverPath;
//       if (req.files.photo) {
//         let pic = req.files.photo.data;
//         filePath = await uploadFile(pic, `${user_id}/profie_${datetime}`);
//         thumbnailfile = await uploadFile(
//           pic,
//           `${user_id}/thumbnail_${datetime}`
//         );
//       }

//       if (req.files.cover_image) {
//         let cover = req.files.cover_image.data;
//         coverPath = await uploadFile(cover, `${user_id}/cover_${datetime}`);
//       }

//       const user = await User.findByIdAndUpdate(
//         { _id: user_id },
//         {
//           $set: {
//             profile_image: filePath,
//             thumbnail_image: thumbnailfile,
//             cover_image: coverPath,
//           },
//         },
//         {
//           new: true,
//         }
//       );

//       const users = await userDetails({
//         _id: mongoose.Types.ObjectId(user_id),
//       });

//       return res.status(200).json({
//         success: true,
//         user: users[0],
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: " Only admin can edit user details.",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };


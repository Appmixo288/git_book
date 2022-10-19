const express = require("express");
const { isAuthentication} = require('../middleware/auth');

const router = express.Router();
const {
    getAllTag,
  createTag,
  verifyTag,
  getTagUesrs,
  deleteTag,
  deleteadminTag,
  searchtag
} = require("../controllers/tagController");

//create tag
router.route("/newtag").post(isAuthentication,createTag);

//get all tag 
router.route("/alltags").get(getAllTag);

//verify tag admin
router.route("/verifytag").put(isAuthentication,verifyTag);

//user wise get tag
router.route("/userwisetag").get(isAuthentication,getTagUesrs);

// delete all tag particuler user.
router.route("/deletetag").delete(isAuthentication,deleteTag);

//delete a particuler tag  admin
router.route("/deleteadmintag").delete(isAuthentication,deleteadminTag);

//search tag 
router.route("/searchtag").get(searchtag);

module.exports = router;

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const Post = require("../models/postModel");

//get all posts
router.get("/allposts", authMiddleware, (req, res) => {
  Post.find()
    .populate("postedBy", "id name")
    .then((posts) => res.json(posts))
    .catch((err) => {
      console.log(err);
      res.status(500).send("ServerError");
    });
});

//get user posts
router.get("/myposts", authMiddleware, (req, res) => {
  Post.find({ postedBy: req.user.id })
    .populate("postedBy", "id name")
    .then((posts) => res.json({ posts }))
    .catch((err) => {
      console.log(err);
      res.status(500).send("ServerError");
    });
});

//create a a post
router.post(
  "/createpost",
  [
    check("title", "Enter the Title").exists(),
    check("body", "Enter The Body").exists(),
  ],
  authMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select("-password");
    try {
      const post = new Post({
        title: req.body.title,
        body: req.body.body,
        postedBy: user,
      });

      await post.save();

      res.status(200).json({ post: post });
    } catch (err) {
      console.log(err);

      res.status(500).send("ServerError");
    }
  }
);

module.exports = router;

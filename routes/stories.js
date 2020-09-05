const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");

// @desc    Show Add page
// @route   GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc    Process add form
// @route   POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});

// @desc    Get single Story
// @route   GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  const _id = req.params.id;

  try {
    const story = await Story.findById({ _id }).populate("user").lean();

    if (!story) {
      return res.render("errors/404");
    }

    res.render("stories/show", {
      story,
    });
  } catch (err) {
    console.log(err);
    return res.render("errors/500");
  }
});

// @desc    Show all stories
// @route   GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});

// @desc    User stories
// @route   GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  const userId = req.params.userId;

  try {
    const stories = await Story.find({
      user: userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const storyId = req.params.id;

  try {
    const story = await Story.findById({ _id: storyId }).lean();

    if (!story) {
      return res.render("errors/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story,
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("errors/500");
  }
});

// @desc    Update Story
// @route   PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  const _id = req.params.id;

  try {
    let story = await Story.findById({ _id }).lean();

    if (!story) {
      return res.reneder("errors/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
    return res.render("errors/500");
  }
});

// @desc    Delete Story
// @route   DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  const _id = req.params.id;

  try {
    await Story.remove({ _id });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    return res.render("errors/500");
  }
});

module.exports = router;

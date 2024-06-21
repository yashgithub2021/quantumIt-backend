const BlogModel = require("../models/blogModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const { uploadImage } = require('../utils/aws');

exports.CreateBlog = catchAsyncError(async (req, res, next) => {
  console.log('req.files:', req.files); // Debugging log

  const {
    title,
    description,
    category,
    readTime,
    detailedInsights,
    keyPoints,
    keyInsights,
    quote,
    AuthorName,
    AuthorDesignation,
    AuthorAbout,
    facebook,
    twitter,
    instagram
  } = req.body;

  const blogImage = req.files?.[0];
  const authorProfile = req.files?.[1];

  if (!blogImage || !authorProfile) {
    return res.status(400).json({
      success: false,
      message: "Blog image and author profile are required."
    });
  }

  const blogImageLoc = await uploadImage(blogImage);
  const authorProfileLoc = await uploadImage(authorProfile);

  if (
    !title ||
    !description ||
    !category ||
    !readTime ||
    !detailedInsights ||
    !keyPoints ||
    !keyInsights ||
    !quote ||
    !facebook ||
    !twitter ||
    !instagram
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields"
    });
  }

  const authorObj = {
    authorName: AuthorName,
    profileImg: authorProfileLoc,
    designation: AuthorDesignation,
    about: AuthorAbout,
    socialMedia: {
      facebook,
      twitter,
      instagram
    }
  };

  try {
    const blog = new BlogModel({
      title,
      description,
      category,
      image: blogImageLoc,
      readTime,
      detailedInsights,
      keyPoints,
      keyInsights,
      quote,
      author: authorObj
    });
    await blog.save();
    res.status(200).json({
      success: true,
      message: "Saved Successfully",
      blog,
    });
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error saving your blog with backend for ref. ${e}`,
        500,
      ),
    );
  }
});


exports.GetBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  let blogs;
  try {
    if (id) {
      blogs = await BlogModel.findById(new mongoose.Types.ObjectId(id));
    }
    else {
      blogs = await BlogModel.find().select('-detailedInsights -keyPoints -keyInsights -quote -author.profileImg -author.socialMedia -author.designation -author.about');
    }
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error getting blogs from backend for ref. ${e}`,
        500,
      ),
    );
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    blogs: blogs,
  });
});

exports.EditBlog = catchAsyncError(async (req, res, next) => {
  const blogId = req.params.id;
  console.log('req.files:', req.files); // Debugging log

  const {
    title,
    description,
    category,
    readTime,
    detailedInsights,
    keyPoints,
    keyInsights,
    quote,
    AuthorName,
    AuthorDesignation,
    AuthorAbout,
    facebook,
    twitter,
    instagram
  } = req.body;

  const blogImage = req.files?.[0];
  const authorProfile = req.files?.[1];

  let blogImageLoc, authorProfileLoc;

  if (blogImage) {
    blogImageLoc = await uploadImage(blogImage);
  }
  if (authorProfile) {
    authorProfileLoc = await uploadImage(authorProfile);
  }

  if (
    !title ||
    !description ||
    !category ||
    !readTime ||
    !detailedInsights ||
    !keyPoints ||
    !keyInsights ||
    !quote ||
    !facebook ||
    !twitter ||
    !instagram
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields"
    });
  }

  const authorObj = {
    authorName: AuthorName,
    designation: AuthorDesignation,
    about: AuthorAbout,
    socialMedia: {
      facebook,
      twitter,
      instagram
    }
  };

  if (authorProfileLoc) {
    authorObj.profileImg = authorProfileLoc;
  }

  try {
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    blog.title = title;
    blog.description = description;
    blog.category = category;
    if (blogImageLoc) {
      blog.image = blogImageLoc;
    }
    blog.readTime = readTime;
    blog.detailedInsights = detailedInsights;
    blog.keyPoints = keyPoints;
    blog.keyInsights = keyInsights;
    blog.quote = quote;
    blog.author = authorObj;

    await blog.save();
    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      blog,
    });
  } catch (e) {
    return next(
      new ErrorHandler(
        `There is some error updating your blog with backend for ref. ${e}`,
        500,
      ),
    );
  }
});


exports.DeleteBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  try {
    const result = await BlogModel.deleteOne(new mongoose.Types.ObjectId(id));
    if (result.deletedCount)
      res.status(200).json({
        success: true,
        message: "Deleted Successfully",
      }); else {
      res.status(200).json({
        success: false,
        message: "Didn't find a matching query",
      });
    }
  } catch (e) {
    return next(new ErrorHandler(`Error While deleting for ref.${e}`, 500));
  }
});

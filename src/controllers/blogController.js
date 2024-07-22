const BlogModel = require("../models/blogModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const { uploadImage } = require('../utils/aws');

const blog1 = {
  title: 'A Complete Guide on Robotic Process Automation(RPA)',
  description: 'Robotic Process Automation bots have an equivalent digital skillset as people. Consider RPA bots as a Digital Workforce which will interact with any system or application. For instance, bots are ready to copy-paste, scrape web data, make calculations, open and move files, parse emails, log into programs, hook up with APIs, and extract unstructured data. And since bots can adapt to any interface or workflow, theres no change in business systems, applications, or existing processes to automate. RPA bots are easy to line up, use, and share. If you recognize how to record video on your phone, you`ll be ready to configure RPA bots. It` as intuitive as hitting record, play, and stop buttons and using drag-and-drop to manoeuvre files around at work. RPA bots are often scheduled, cloned, customized, and shared to execute business processes throughout the organization. As the world is moving forward to using technologies, automation has improved its ways to make our work easier. Though the word automation was coined within the 1950s, only a few people understood what it meant. So, during this blog on `What is RPA`? I will discuss what exactly is robotic process automation and its various factors.',
  category: 'Robotic Process Automation',
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/rpa1.jpg',
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/rpa2.jpg',
  readTime: '5 minutes', quote: 'While RPA vendors vary within the degree to which they will accurately claim no-code or low-code, the consensus is that [most] RPA software allows a business user to style and develop',

};

const blog2 = {
  title: '7 Local Online Marketing Tips to Help You Get Started',
  description: 'The online market is the new trend in business. It has a wide range of niches to work on. Every brand today has an online store for all customers because that’s how the Generation is evolving. So, if you were also looking for ways to get your online market started then you’ve landed up at the very correct place to do so. Online marketing and advertising for online marketing doesn’t require any rocket science. You can reach the audience very easily with some simple tips. ',
  category: 'Digital Marketing',
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/m1.jpg',
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/m2.jpg',
  readTime: '5 Minutes',
  quote: 'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',

};

const blog3 = {
  _id: '00000000-6679-5ec3-a37d-607032b766b5',
  title: '10 Tips And Tricks To Become a Better Android Developer',
  description: 'There is no shortcut to success, but if you are willing to learn and put in some effort, you will surely get all the accomplishment you deserve. Android development is easy, but becoming a fortune Android developer and exiting out from the rest is not. You are required to put a lot of hard work, affection, adherence, and determination to become extreme at this job. To help you to become a better Android developer, I integrated some extremely useful pro tips from my experience. SO to all those who have decided to jump into Android development or have been working on it for a while, these tips will be suitable for you. Also, know the important tips to know before developing a mobile app.',
  category: 'App Development',
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/t1.jpg',
  readTime: '5 Minutes',
  quote: 'Looking for a company to develop Android Mobile Apps! Hire Quantum It Innovation a prominent Android app development company.',
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/t2.jpg',
};

const blog4 = {
  _id: '00000000-6679-6264-0b49-4ad0884d5e05',
  title: '6 Proven Steps To Responsive Web Design Process',
  description: 'Responsive website design is the need of this world, companies focusing aggressively to make their website responsive to all the devices as the user experience is the most important thing. And during any website SEO, responsive web design is one of the most important elements search engines takes into consideration. But, with lots of devices and variations in screen sizes, make this process a bit complex and hard for web development companies to master “responsive web design” Well, don’t worry! At Quantum IT Innovation we follow the stepwise process to build a responsive website and assure you after following these 6 steps you will be on a new path of successful responsive Web Design Company.',
  category: 'Website Development',
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/w1.jpg',
  readTime: '5 Minutes',
  quote: 'Responsive Web Design always plays important role whenever going to promote your website.',
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/w2.jpg',
};

const blog5 = {
  _id: '00000000-6679-6860-0b49-4ad0884d5e09',
  title: 'How To Rank In The App Store',
  description: 'Mobile app rank is the toughest task in the App store. There are nearly 2,000,000 and counting apps are present in the iOS app store with thousands of similar application in every category or subcategory. Like SEO website, there are both “on page” (App store listing) and “off page” ways you can improve your App store optimization. The tactics in this round-up will help you get more installation and get more visibility to your application. 65% of users are still searching for new apps on the App Store. Every company wants its mobile app rank in the top 10 on the App store, to rank high company has to play hard. You must continuously optimize your application and upgrade it as users need. A thousand apps are launched every day and the app store has to analyses each application to find out the unique one, that meets its guidelines. Just follow the below points to rank your mobile app high.',
  category: 'App Store Optimization',
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/dm1.jpg',
  readTime: '5 Minutes',
  quote: 'Use relevant and popular keywords in your app’s title and description to improve search visibility.',
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/dm2.jpeg',
};

async function createProject(data) {
  try {
    const newProject = await BlogModel.create(data);
    console.log('Project created successfully:', newProject);
  } catch (error) {
    console.error('Error creating project:', error);
  }
}
// createProject(blog1)
// createProject(blog2)
// createProject(blog3)
// createProject(blog4)
// createProject(blog5)

exports.CreateBlog = async (req, res, next) => {
  console.log('req.files:', req.files); // Debugging log

  const {
    title,
    description,
    category,
    readTime,
    quote
  } = req.body;

  if (!title || !description || !category || !readTime || !quote)
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });

  const blogImage = req.files?.[0];
  const blogImage2 = req.files?.[1];

  if (!blogImage || !blogImage2) {
    return res.status(400).json({
      success: false,
      message: "Blog images are required."
    });
  }

  try {
    const blog = await BlogModel.create({
      title,
      description,
      category,
      image: await uploadImage(blogImage),
      image2: await uploadImage(blogImage2),
      readTime,
      quote,
    })

    res.status(200).json({
      success: true,
      message: "Saved Successfully",
      blog,
    });
  } catch (e) {
    console.error(e);
    return next(new ErrorHandler(`Error while saving the blog: ${e.message}`, 500));
  }
};



exports.GetBlog = async (req, res, next) => {
  const { id } = req.query;
  try {
    let blogs;
    if (id) {
      blogs = await BlogModel.findByPk(id);
    } else {
      blogs = await BlogModel.findAll({
        order: [['createdAt', 'DESC']]
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      blogs,
    });
  } catch (e) {
    return next(new ErrorHandler(`Error while fetching blogs: ${e.message}`, 500));
  }
};

exports.getBlogByCat = catchAsyncError(async (req, res, next) => {
  const { category } = req.body

  if (!category)
    return next(new ErrorHandler("Category is required", 400))

  const blogs = await BlogModel.findAll({
    where: {
      category: category
    }
  })

  res.status(200).json({ success: true, blogs })
})

exports.EditBlog = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    readTime,
    quote,
  } = req.body;

  const files = req.files || [];

  // Ensure files is an array
  if (!Array.isArray(files)) {
    return res.status(400).json({
      success: false,
      message: "Files must be an array"
    });
  }

  const uploadPromises = files.map(file => uploadImage(file));

  try {
    // Await Promise.all only if there are files to upload
    let uploadResults = [];
    if (files.length > 0) {
      uploadResults = await Promise.all(uploadPromises);
    }

    const [blogImageLoc, blogImage2Loc] = uploadResults;

    let blog = await BlogModel.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const updatedBlog = await blog.update({
      title: title || blog.title,
      description: description || blog.description,
      category: category || blog.category,
      image: blogImageLoc || blog.image,
      image2: blogImage2Loc || blog.image2,
      readTime: readTime || blog.readTime,
      quote: quote || blog.quote,
    });

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      blog: updatedBlog,
    });
  } catch (e) {
    return next(
      new ErrorHandler(
        `There was an error updating your blog: ${e.message}`,
        500,
      ),
    );
  }
};





exports.DeleteBlog = async (req, res, next) => {
  const { id } = req.params;

  console.log("iiiddd", id)
  try {
    const result = await BlogModel.destroy({
      where: {
        id
      }
    });
    if (result) {
      res.status(200).json({
        success: true,
        message: "Deleted Successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
  } catch (e) {
    return next(new ErrorHandler(`Error while deleting the blog: ${e.message}`, 500));
  }
};
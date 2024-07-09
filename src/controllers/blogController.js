const BlogModel = require("../models/blogModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const { uploadImage } = require('../utils/aws');

const blog1 = {
  title: 'A Complete Guide on Robotic Process Automation(RPA)',
  description: 'Robotic Process Automation bots have an equivalent digital skillset as people. Consider RPA bots as a Digital Workforce which will interact with any system or application. For instance, bots are ready to copy-paste, scrape web data, make calculations, open and move files, parse emails, log into programs, hook up with APIs, and extract unstructured data. And since bots can adapt to any interface or workflow, theres no change in business systems, applications, or existing processes to automate. RPA bots are easy to line up, use, and share. If you recognize how to record video on your phone, you`ll be ready to configure RPA bots. It` as intuitive as hitting record, play, and stop buttons and using drag-and-drop to manoeuvre files around at work. RPA bots are often scheduled, cloned, customized, and shared to execute business processes throughout the organization. As the world is moving forward to using technologies, automation has improved its ways to make our work easier. Though the word automation was coined within the 1950s, only a few people understood what it meant. So, during this blog on `What is RPA`? I will discuss what exactly is robotic process automation and its various factors.',
  category: ['Robotic Process Automation'],
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/rpa1.jpg',
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/rpa2.jpg',
  readTime: '5 minutes',
  detailedInsights: 'RPA works by accessing information from your existing IT systems. There are numerous ways in which RPA tools can integrate with your applications. One option is through connections to databases and enterprise web services within the backend. Another is through front or desktop connections that take multiple forms. The best way depends on your enterprise and, therefore, the needs that the answer will address. With backend connectivity, your automation accesses systems and services under the control of a process automation server. This is often most ordinarily used for unattended automation, where your software robots perform back-office tasks like processing insurance claims at scale and with minimal to no employee intervention. This question has always popped on whether RPA uses physical robots or whether robots present to automate tasks. Well, let me tell you that RPA doesn`t replace humans with actual robots. But, there are software available within the market that allows you to configure automation workflows to automate your business operations. Consistent with our experts, the demand for RPA certification training increases by 150%, thanks to the market shortage. Though I even have mentioned that RPA is implemented through software that is nothing but RPA Tools/Vendors, let me tell you a couple of guidelines to start with RPA before discussing tools.',
  keyPoints: ['Cost-Effective', 'Employee Empowerment', 'Enhanced Cycle Time', 'Quality Work', 'Insights and Analytics'],
  keyInsights: ['Quote-to-Cash,Procure-to-Pay', 'Customer Onboarding', 'Employee Onboarding', 'Data Migration and Data Entry', 'Data Validation,Extracting Data from PDFs', 'Scanned Documents'],
  quote: 'While RPA vendors vary within the degree to which they will accurately claim no-code or low-code, the consensus is that [most] RPA software allows a business user to style and develop',
  authorName: 'Dharmendra Tripathi',
  profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/rpa2.jpg',
  designation: 'CEO',
  about: 'This is about all of author',
  socialMedia: {
    facebook: 'facebook.com',
    twitter: 'twitter.com',
    instagram: 'instagram.com'
  }
};

const blog2 = {
  title: '7 Local Online Marketing Tips to Help You Get Started',
  description: 'The online market is the new trend in business. It has a wide range of niches to work on. Every brand today has an online store for all customers because that’s how the Generation is evolving. So, if you were also looking for ways to get your online market started then you’ve landed up at the very correct place to do so. Online marketing and advertising for online marketing doesn’t require any rocket science. You can reach the audience very easily with some simple tips. ',
  category: ['Digital Marketing'],
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/m1.jpg',
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/m2.jpg',
  readTime: '5 Minutes',
  detailedInsights: 'When you start up a business, there are some things that you need to decide prior. The market that you wish to set up might be age-restricted. Online businesses like bookstores, clothing stores for different age groups are present. This will give you an upper hand in local internet marketing. These two online marketing tips are key. If you’re not targeting the right group of people, you’re going to lose money. It’s as simple as that. You will need to aggressively research your target market, or hire an online marketing company to do it for you. An easy way to do this is to build a lookalike audience on Facebook. This targets users who “look like” your target audience whether it’s age, gender, interests, or other demographics.',
  keyPoints: ['Know your Target Audience', 'Optimize your Site', 'Write Blogs'],
  keyInsights: ['Attractive Website Design', 'Local Online Marketing', 'Social Media Engagement', 'PPC Ads: Local Internet Marketing', 'Email Marketing'],
  quote: 'In the world of Internet Customer Service, it’s important to remember your competitor is only one mouse click away.',
  authorName: 'Dharmendra Tripathi',
  profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/m2.jpg',
  designation: 'CEO',
  about: 'CEO of Company',
  socialMedia: {
    facebook: 'facebook.com',
    twitter: 'twitter.com',
    instagram: 'instagram.com'
  }
};

const blog3 = {
  _id: '00000000-6679-5ec3-a37d-607032b766b5',
  title: '10 Tips And Tricks To Become a Better Android Developer',
  description: 'There is no shortcut to success, but if you are willing to learn and put in some effort, you will surely get all the accomplishment you deserve. Android development is easy, but becoming a fortune Android developer and exiting out from the rest is not. You are required to put a lot of hard work, affection, adherence, and determination to become extreme at this job. To help you to become a better Android developer, I integrated some extremely useful pro tips from my experience. SO to all those who have decided to jump into Android development or have been working on it for a while, these tips will be suitable for you. Also, know the important tips to know before developing a mobile app.',
  category: ['App Development'],
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/t1.jpg',
  readTime: '5 Minutes',
  detailedInsights: 'Knowing the latest Android App Development trends is essential because with this you get to know what users actually expect about the functionality and features of an app today. With technology advancement, you need to envisage your options and be aware of some of the leading ideas for mobile app development.',
  keyPoints: ['Know the latest trends', 'Start small but Expand slowly', 'Try to learn about designs', 'Visit meet-ups, and be social with other developers', 'Believe in your idea'],
  keyInsights: ['Start reading a lot more code', 'Consider learning more languages', 'Don’t give up so easily'],
  quote: 'Looking for a company to develop Android Mobile Apps! Hire Quantum It Innovation a prominent Android app development company.',
  authorName: 'Dharmendra Tripathi',
  profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/m2.jpg',
  designation: 'Digital Marketing Strategist',
  about: 'About',
  socialMedia: {
    facebook: 'facebook.com',
    twitter: 'twitter.com',
    instagram: 'instagram.com'
  },
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/t2.jpg',
  __v: 2
};

const blog4 = {
  _id: '00000000-6679-6264-0b49-4ad0884d5e05',
  title: '6 Proven Steps To Responsive Web Design Process',
  description: 'Responsive website design is the need of this world, companies focusing aggressively to make their website responsive to all the devices as the user experience is the most important thing. And during any website SEO, responsive web design is one of the most important elements search engines takes into consideration. But, with lots of devices and variations in screen sizes, make this process a bit complex and hard for web development companies to master “responsive web design” Well, don’t worry! At Quantum IT Innovation we follow the stepwise process to build a responsive website and assure you after following these 6 steps you will be on a new path of successful responsive Web Design Company.',
  category: ['Website Development'],
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/w1.jpg',
  readTime: '5 Minutes',
  detailedInsights: 'Majorly when you get a new project your interaction with the clients is just two times, once in the beginning when handing you the new website project and one in the last when you completed the website. But, to make the website responsive you have to bring openness to your company culture.',
  keyPoints: ['Content first approach', 'Sketch it out', 'Responsive the images and content', 'Media queries', 'Testing'],
  keyInsights: ['Average page session duration', 'Returning visitors'],
  quote: 'Responsive Web Design always plays important role whenever going to promote your website.',
  authorName: 'Dharmendra Tripathi',
  profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/m2.jpg',
  designation: 'Digital Marketing Strategist',
  about: 'Dharmendra Tripathi is the Digital Marketing Strategist at Quantum IT Innovation. Experience with both startups and enterprise clients has given him a unique perspective worldwide. He loves writing on content strategy, marketing, and optimization initiatives on SEO, PPC & SMO. Primarily works on improving conversion rates for medium/large customers around the world.',
  socialMedia: {
    facebook: 'facebook.com',
    twitter: 'twitter.com',
    instagram: 'instagram.com'
  },
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/w2.jpg',
  __v: 2
};

const blog5 = {
  _id: '00000000-6679-6860-0b49-4ad0884d5e09',
  title: 'How To Rank In The App Store',
  description: 'Mobile app rank is the toughest task in the App store. There are nearly 2,000,000 and counting apps are present in the iOS app store with thousands of similar application in every category or subcategory. Like SEO website, there are both “on page” (App store listing) and “off page” ways you can improve your App store optimization. The tactics in this round-up will help you get more installation and get more visibility to your application. 65% of users are still searching for new apps on the App Store. Every company wants its mobile app rank in the top 10 on the App store, to rank high company has to play hard. You must continuously optimize your application and upgrade it as users need. A thousand apps are launched every day and the app store has to analyses each application to find out the unique one, that meets its guidelines. Just follow the below points to rank your mobile app high.',
  category: ['App Store Optimization'],
  image: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/dm1.jpg',
  readTime: '5 Minutes',
  detailedInsights: 'Apple allows you to add your keywords in App store listing. The search algorithm uses these keywords to show your app in the result, and therefore it is important to put the appropriate keyword which perfectly describes your app. You can use your keywords up to 100 characters, don’t make long tail keywords such as plurals or name of your app or misspellings in the field of your keyword. Separate keywords with commas and don’t use extra spaces between them. Keep your app description users friendly because the description is important in telling people what your app actually does. The App store optimization never stops so, you should find more way to improve your listing as you take a deep dive into the topic.',
  keyPoints: ['Keep your keywords within 100 characters.', 'App store optimization leads to better', 'Earn Positive Reviews', 'Retain Users and Earn Their Loyalty', 'High Rank in the App Store'],
  keyInsights: ['Keep your keywords within 100 characters.', 'App store optimization leads to better', 'Earn Positive Reviews', 'Retain Users and Earn Their Loyalty', 'High Rank in the App Store'],
  quote: 'Use relevant and popular keywords in your app’s title and description to improve search visibility.',
  authorName: 'Dharmendra Tripathi',
  profileImg: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/m2.jpg',
  designation: 'Digital Marketing Strategist',
  about: 'Dharmendra Tripathi is the Digital Marketing Strategist at Quantum IT Innovation. Experience with both startups and enterprise clients has given him a unique perspective worldwide. He loves writing on content strategy, marketing, and optimization initiatives on SEO, PPC & SMO. Primarily works on improving conversion rates for medium/large customers around the world.',
  socialMedia: {
    facebook: 'facebook.com',
    twitter: 'twitter.com',
    instagram: 'instagram.com'
  },
  image2: 'https://karmill.s3.us-east-1.amazonaws.com/profile_pictures/dm2.jpeg',
  __v: 1
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
    detailedInsights,
    keyPoints,
    keyInsights,
    quote,
    authorName,
    authorDesignation,
    authorAbout,
    facebook,
    twitter,
    instagram
  } = req.body;

  const blogImage = req.files?.[0];
  const blogImage2 = req.files?.[1];
  const profileImg = req.files?.[2];

  if (!blogImage || !profileImg || !blogImage2) {
    return res.status(400).json({
      success: false,
      message: "Blog images and author profile are required."
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
      detailedInsights,
      keyPoints,
      keyInsights,
      quote,
      authorName,
      designation: authorDesignation,
      about: authorAbout,
      profileImg: await uploadImage(profileImg),
      socialMedia: {
        facebook,
        twitter,
        instagram
      }
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
      blogs = await BlogModel.findAll();
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

exports.EditBlog = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    readTime,
    detailedInsights,
    keyPoints,
    keyInsights,
    quote,
    authorName,
    authorDesignation,
    authorAbout,
    facebook,
    twitter,
    instagram
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

    const [blogImageLoc, blogImage2Loc, authorProfileLoc] = uploadResults;

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
      detailedInsights: detailedInsights || blog.detailedInsights,
      keyPoints: keyPoints || blog.keyPoints,
      keyInsights: keyInsights || blog.keyInsights,
      quote: quote || blog.quote,
      authorName: authorName || blog.authorName,
      designation: authorDesignation || blog.designation,
      about: authorAbout || blog.about,
      'socialMedia.facebook': facebook || blog.socialMedia.facebook,
      'socialMedia.twitter': twitter || blog.socialMedia.twitter,
      'socialMedia.instagram': instagram || blog.socialMedia.instagram,
      profileImg: authorProfileLoc || blog.profileImg,
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
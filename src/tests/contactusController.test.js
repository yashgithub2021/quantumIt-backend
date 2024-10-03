const { CreateContactUsQuery } = require("../controllers/contactusController");
const ContactUsModel = require("../models/contactusModel");
const { uploadFile } = require("../utils/aws");
const ErrorHandler = require("../utils/ErrorHandler");
const nodemailer = require("nodemailer");

jest.mock("../models/contactusModel");
jest.mock("../utils/aws");
jest.mock("nodemailer");

describe("CreateContactUsQuery", () => {
  let req, res, next, transporterMock, sendMailMock;

  beforeEach(() => {
    // Mock request object
    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone_no: "1234567890",
        companyName: "Example Company",
        message: "This is a test message.",
        about: "sales",
        ip_address: "127.0.0.1",
        location: "New York",
      },
      files: [],
    };

    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock next function
    next = jest.fn();

    // Mock the nodemailer transporter and sendMail function
    sendMailMock = jest.fn((mailOptions, callback) =>
      callback(null, { response: "Email sent" })
    );
    transporterMock = {
      sendMail: sendMailMock,
    };

    nodemailer.createTransport.mockReturnValue(transporterMock);
  });

  it("should return an error if ip_address or location is missing", async () => {
    req.body.ip_address = null;

    await CreateContactUsQuery(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new ErrorHandler("Ip Address and Location is required")
    );
  });

  it("should create a query successfully without resume", async () => {
    ContactUsModel.create.mockResolvedValue({ id: 1, ...req.body });

    await CreateContactUsQuery(req, res, next);

    expect(ContactUsModel.create).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone_no: "1234567890",
      companyName: "Example Company",
      message: "This is a test message.",
      resume: undefined,
      about: "sales",
      ip_address: "127.0.0.1",
      location: "New York",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Saved Successfully",
      query: { id: 1, ...req.body },
    });
  });

  it("should handle file uploads correctly", async () => {
    req.files = [
      { originalname: "resume.pdf", buffer: Buffer.from("file data") },
    ];
    uploadFile.mockResolvedValue("https://example.com/path/to/resume.pdf");

    ContactUsModel.create.mockResolvedValue({
      id: 1,
      ...req.body,
      resume: "https://example.com/path/to/resume.pdf",
    });

    await CreateContactUsQuery(req, res, next);

    expect(uploadFile).toHaveBeenCalledWith(req.files[0]);

    expect(ContactUsModel.create).toHaveBeenCalledWith({
      ...req.body,
      resume: "https://example.com/path/to/resume.pdf",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Saved Successfully",
      query: {
        id: 1,
        ...req.body,
        resume: "https://example.com/path/to/resume.pdf",
      },
    });
  });

  it("should send email to sales if 'about' is present", async () => {
    ContactUsModel.create.mockResolvedValue({ id: 1, ...req.body });

    await CreateContactUsQuery(req, res, next);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "john.doe@example.com",
        to: "sales@quantumitinnovation.com",
        subject: "New Enquiry for sales",
      }),
      expect.any(Function)
    );
  });

  it("should send email to HR if resume is present", async () => {
    req.files = [
      { originalname: "resume.pdf", buffer: Buffer.from("file data") },
    ];
    uploadFile.mockResolvedValue("https://example.com/path/to/resume.pdf");

    await CreateContactUsQuery(req, res, next);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "john.doe@example.com",
        to: "hr@quantumitinnovation.com",
        subject: "New Resume Submission",
      }),
      expect.any(Function)
    );
  });

  it("should handle errors during query creation", async () => {
    ContactUsModel.create.mockRejectedValue(new Error("Database error"));

    await CreateContactUsQuery(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error saving the query: Database error",
    });
  });

  it("should handle errors during email sending", async () => {
    ContactUsModel.create.mockResolvedValue({ id: 1, ...req.body });

    sendMailMock.mockImplementation((mailOptions, callback) =>
      callback(new Error("Email sending error"), null)
    );

    await CreateContactUsQuery(req, res, next);

    expect(sendMailMock).toHaveBeenCalled();
  });
});

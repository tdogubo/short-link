const ShortLinkController = require("../../src/controllers/short-link.controller");
const ShortLinkService = require("../../src/services/short-link.service");
const httpStatusCode = require("../../src/utils/http-status-code");
const catchAsync = require("../../src/utils/catch-async");

jest.mock("../../src/services/short-link.service");
const url = "https://example.com/abc123h";
const id = "abc123ku8h";
const host = "localhost:3000";
const shortUrl = `http://${host}/${id}`;

const response = {
  id,
  originalUrl: url,
  shortUrl,
  created: Date.now(),
};

// Mock request and response objects

describe("short-link controller encode url tests", () => {
  const req = {
    body: { url },
    headers: { host },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  it("should return a shortURL in response body", async () => {
    // Mock the response from shortLinkService
    const urlInfo = { url: shortUrl };
    ShortLinkService.encodeUrl.mockResolvedValue(response);

    // Wrap the controller function with catchAsync middleware
    const wrappedController = catchAsync(ShortLinkController.encoder);

    // Call the wrapped controller function
    await wrappedController(req, res);

    // Assertions
    expect(ShortLinkService.encodeUrl).toHaveBeenCalledWith(url, host);
    expect(ShortLinkService.encodeUrl).toHaveReturned();
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.CREATED);
    expect(res.send).toHaveBeenCalledWith({
      data: urlInfo,
    });
  });

  it("should return httpStatusCode.BAD_REQUEST", async () => {
    const response = {
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    };

    // Mock the response from shortLinkService
    ShortLinkService.encodeUrl.mockRejectedValue();

    // Wrap the controller function with catchAsync middleware
    const wrappedController = catchAsync(ShortLinkController.encoder);

    // Call the wrapped controller function
    await wrappedController(req, res);

    // Assertions
    expect(ShortLinkService.encodeUrl).toHaveBeenCalledWith(url, host);
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR);
    expect(res.send).toHaveBeenCalledWith(response);
  });
});

describe("short-link controller decode url tests", () => {
  // it("should return an originalUrl in response body", async () => {
  //    const req = {
  //      body: { url: shortUrl },
  //      headers: { host },
  //    };
  //    const res = {
  //      status: jest.fn().mockReturnThis(),
  //      send: jest.fn(),
  //    };

  //   // Mock the response from shortLinkService
  //   ShortLinkService.decodeUrl.mockResolvedValue(response);

  //   const urlInfo = { original: url };
  //   // Wrap the controller function with catchAsync middleware
  //   const wrappedController = catchAsync(ShortLinkController.decoder);

  //   // Call the wrapped controller function
  //   await wrappedController(req, res);

  //   // Assertions
  //   expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
  //   expect(ShortLinkService.decodeUrl).toHaveReturned();
  //   expect(res.status).toHaveBeenCalledWith(httpStatusCode.OK);
  //   expect(res.send).toHaveBeenCalledWith({
  //     data: urlInfo,
  //   });
  // });

  it("should return httpStatusCode.BAD_REQUEST because of wrong host", async () => {
    const req = {
      body: { url },
      headers: { host },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }; // changed the url and body  to the original instead of using the shortUrl as is required
    const response = {
      error: "Bad Request"
    };

    // Mock the response from shortLinkService
    // ShortLinkService.decodeUrl.mockRejectedValue();

    // Wrap the controller function with catchAsync middleware
    const wrappedController = catchAsync(ShortLinkController.decoder);

    // Call the wrapped controller function
    await wrappedController(req, res);

    // Assertions
    expect(ShortLinkService.decodeUrl).not.toHaveBeenCalledWith(id);
    expect(ShortLinkService.decodeUrl).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(response);
  });

  it("should return httpStatusCode.SERVER_ERROR", async () => {
     const req = {
       body: { url: shortUrl },
       headers: { host },
     };
     const res = {
       status: jest.fn().mockReturnThis(),
       send: jest.fn(),
     };
    const response = {
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    };

    // Mock the response from shortLinkService
    ShortLinkService.decodeUrl.mockRejectedValue();

    // Wrap the controller function with catchAsync middleware
    const wrappedController = catchAsync(ShortLinkController.decoder);

    // Call the wrapped controller function
    await wrappedController(req, res);

    // Assertions
    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR);
    expect(res.send).toHaveBeenCalledWith(response);
  });
});

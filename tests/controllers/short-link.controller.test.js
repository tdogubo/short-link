const ShortLinkController = require("../../src/controllers/short-link.controller");
const ShortLinkService = require("../../src/services/short-link.service");
const httpStatusCode = require("../../src/utils/http-status-code");
const catchAsync = require("../../src/utils/catch-async");
const {
  url,
  host,
  id,
  shortUrl,
  response,
} = require("../mocks/short-link.data");

jest.mock("../../src/services/short-link.service");

afterEach(() => {
  jest.clearAllMocks();
});

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
    const wrappedEncoder = catchAsync(ShortLinkController.encoder);

    // Call the wrapped controller function
    await wrappedEncoder(req, res);

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
    const wrappedEncoder = catchAsync(ShortLinkController.encoder);

    // Call the wrapped controller function
    await wrappedEncoder(req, res);

    // Assertions
    expect(ShortLinkService.encodeUrl).toHaveBeenCalledWith(url, host);
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR);
    expect(res.send).toHaveBeenCalledWith(response);
  });
});

describe("short-link controller decode url tests", () => {
  it("should return an originalUrl in response body", async () => {
    const req = {
      body: { url: shortUrl },
      headers: { host },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the response from shortLinkService
    ShortLinkService.decodeUrl.mockResolvedValue(response);

    const urlInfo = { original: url };
    // Wrap the controller function with catchAsync middleware
    const wrappedDecoder = catchAsync(ShortLinkController.decoder);

    // Call the wrapped controller function
    await wrappedDecoder(req, res);

    // Assertions
    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(ShortLinkService.decodeUrl).toHaveReturned();
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.OK);
    expect(res.send).toHaveBeenCalledWith({
      data: urlInfo,
    });
  });

  it("should return httpStatusCode.BAD_REQUEST because of mismatched base url", async () => {
    const req = {
      body: { url: "https://example.com/abc123h" },
      headers: { host },
    }; // changed the url and body  to the original instead of using the shortUrl as is required

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const response = {
      error: "Bad Request",
    };

    // Wrap the controller function with catchAsync middleware
    const wrappedDecoder = catchAsync(ShortLinkController.decoder);

    // Call the wrapped controller function
    await wrappedDecoder(req, res);

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
    const wrappedDecoder = catchAsync(ShortLinkController.decoder);

    // Call the wrapped controller function
    await wrappedDecoder(req, res);

    // Assertions
    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR);
    expect(res.send).toHaveBeenCalledWith(response);
  });
});

describe("short-link controller statistics from url", () => {
  it("should return the url statistics in response body and http OK status", async () => {
    const req = {
      params: { id },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the response from shortLinkService
    ShortLinkService.decodeUrl.mockResolvedValue(response);

    // Wrap the controller function with catchAsync middleware
    const wrappedStatisticsController = catchAsync(
      ShortLinkController.statistics
    );

    // Call the wrapped controller function
    await wrappedStatisticsController(req, res);

    // Assertions
    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(ShortLinkService.decodeUrl).toHaveReturned();
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.OK);
    expect(res.send).toHaveBeenCalledWith({
      data: response,
    });
  });

  it("should return http BAD_REQUEST status because the url id is not found in the database", async () => {
    const req = {
      params: { id },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const response = {
      error: "Bad Request",
    };

    // Mock the response from shortLinkService
    ShortLinkService.decodeUrl.mockResolvedValue(undefined);

    // Wrap the controller function with catchAsync middleware
    const wrappedStatisticsController = catchAsync(
      ShortLinkController.statistics
    );

    // Call the wrapped controller function
    await wrappedStatisticsController(req, res);

    // Assertions
    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(ShortLinkService.decodeUrl).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(response);
  });

  it("should return http SERVER_ERROR status because of a database related error in the search", async () => {
    const req = {
      params: { id },
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
    const wrappedStatisticsController = catchAsync(
      ShortLinkController.statistics
    );

    // Call the wrapped controller function
    await wrappedStatisticsController(req, res);

    // Assertions
    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR);
    expect(res.send).toHaveBeenCalledWith(response);
  });
});

describe("short-link controller redirect url from url", () => {
  it("should call updateVisits function", async () => {
    const req = { params: { id } };
    const res = {
      redirect: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    ShortLinkService.decodeUrl.mockResolvedValue(response);

    const wrappedRedirect = catchAsync(ShortLinkController.redirect);

    await wrappedRedirect(req, res);

    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(ShortLinkService.updateVisits).toHaveBeenCalledWith(id);
    expect(ShortLinkService.decodeUrl).toHaveReturned();
  });

  it("should return http BAD_REQUEST status because the url id is not found in the database", async () => {
    const req = { params: { id } };
    const res = {
      redirect: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const response = {
      error: "Bad Request",
    };

    ShortLinkService.decodeUrl.mockResolvedValue(undefined);

    const wrappedRedirect = catchAsync(ShortLinkController.statistics);

    await wrappedRedirect(req, res);

    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(ShortLinkService.updateVisits).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(response);
  });

  it("should return http SERVER_ERROR status because of a database related error in the search", async () => {
    const req = { params: { id } };
    const res = {
      redirect: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const response = {
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    };

    ShortLinkService.decodeUrl.mockRejectedValue();

    const wrappedRedirect = catchAsync(ShortLinkController.statistics);

    await wrappedRedirect(req, res);

    expect(ShortLinkService.decodeUrl).toHaveBeenCalledWith(id);
    expect(ShortLinkService.updateVisits).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.SERVER_ERROR);
    expect(res.send).toHaveBeenCalledWith(response);
  });
});

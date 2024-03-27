const {
  shortLinkController,
} = require("../../src/controllers/short-link.controller");
const { encodeUrl } = require("../../src/services/short-link.service");
const httpStatusCode = require("../../src/utils/http-status-code");
const catchAsync = require("../../src/utils/catch-async");

jest.mock("../../src/services/short-link.service");

describe("short-link controller tests", () => {
  const url = "https://example.com";
  const id = "abc123";
  const host = "localhost:3000";
  it("should return a short URL", async () => {
    // Mock request and response objects
    const req = {
      body: { url },
      headers: { host },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the response from shortLinkService
    const urlInfo = { id, shortUrl: `http://${host}/${id}` };
    encodeUrl.mockResolvedValue(urlInfo);

    // Wrap the controller function with catchAsync middleware
    const wrappedController = catchAsync(shortLinkController);

    // Call the wrapped controller function
    await wrappedController(req, res);

    // Assertions
    expect(encodeUrl).toHaveBeenCalledWith(url, host);
    expect(res.status).toHaveBeenCalledWith(httpStatusCode.CREATED);
    expect(res.send).toHaveBeenCalledWith({
      data: { ...urlInfo },
    });
  });
  it("should return httpStatusCode.BAD_REQUEST", async () => {
    // Mock request and response objects
    const req = {
      body: {},
      headers: { host: "localhost:3000" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the response from shortLinkService
    encodeUrl.mockRejectedValue();

    // Wrap the controller function with catchAsync middleware
    const wrappedController = catchAsync(shortLinkController);

    // Call the wrapped controller function
    await wrappedController(req, res);

    // Assertions
    expect(encodeUrl).toHaveBeenCalledWith(url, host);
      expect(res.status).toHaveBeenCalledWith(httpStatusCode.BAD_REQUEST);
  });
});

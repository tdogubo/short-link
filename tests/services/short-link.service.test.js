const { Url } = require("../../src/models/short-link.model");
const {
  encodeUrl,
  decodeUrl,
} = require("../../src/services/short-link.service");

jest.mock("../../src/models/short-link.model");

const id = "123456";
const url = "https://example.com";
const baseUrl = "localhost:3000";
const shortUrl = `http://${baseUrl}/123456`;
const createdDate = Date.now();

const data = {
  id,
  originalUrl: url,
  shortUrl,
  created: createdDate,
};

describe("short-link encoder service test", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should return existing encoded URL if it already exists in the database", async () => {
    Url.findOne.mockResolvedValueOnce(data);

    const result = await encodeUrl(url, baseUrl);

    expect(result).toEqual(data);
    expect(Url.findOne).toHaveBeenCalledWith({ where: { originalUrl: url } });
    expect(Url.create).not.toHaveBeenCalled();
  });

  it("should create a new URL entry if it doesn't exist in the database", async () => {
    Url.create.mockResolvedValueOnce(data);
    const result = await encodeUrl(url, baseUrl);

    expect(Url.findOne).toHaveBeenCalledWith({ where: { originalUrl: url } });
    expect(Url.create).toBeCalledTimes(1);
    expect(result).toEqual(data);
  });
});

describe("short-link decoder service test", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should return existing original URL if it already exists in the database", async () => {
    Url.findOne.mockResolvedValueOnce(data);

    const result = await decodeUrl(id);

    expect(result).toEqual(data);
    expect(Url.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(Url.create).not.toHaveBeenCalled();
  });
  it("should return undefined because id does not exist", async () => {
    Url.findOne.mockRejectedValue();

    const result = await decodeUrl(id);

    expect(result).toBeUndefined();
    expect(Url.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(Url.findOne).toHaveReturned();
  });
});

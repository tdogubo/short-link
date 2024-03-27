const { Url } = require("../../src/models/short-link.model");
const { encodeUrl } = require("../../src/services/short-link.service"); 

jest.mock("../../src/models/short-link.model");

describe("short-link service test", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const id = "123456";
  const url = "https://example.com";
  const baseUrl = "localhost:3000";
  const createdDate = Date.now();

  const data = {
    id,
    originalUrl: url,
    shortUrl: `http://${baseUrl}/123456`,
    created: createdDate,
  };

  it("should return existing URL if it already exists in the database", async () => {
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
    expect(result.id).toEqual(id);
    expect(result).toEqual(data);
    expect(result.originalUrl).toEqual(url);
    expect(result.shortUrl).toEqual(`http://${baseUrl}/${id}`);
    expect(result.created).toEqual(createdDate);
  });

  it("should handle errors during database operations", async () => {
      const result = await encodeUrl(url, baseUrl);
    expect(result).toBeUndefined();
    expect(Url.create).toHaveBeenCalled();
  });
});

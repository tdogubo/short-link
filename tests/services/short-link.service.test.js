const { Url } = require("../../src/models/short-link.model");
const {
  encodeUrl,
  decodeUrl,
  updateVisits,
} = require("../../src/services/short-link.service");
const { url, host, id, response } = require("../mocks/short-link.data");

jest.mock("../../src/models/short-link.model");

describe("short-link encoder service test", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should return existing encoded URL if it already exists in the database", async () => {
    Url.findOne.mockResolvedValueOnce(response);

    const result = await encodeUrl(url, host);

    expect(result).toEqual(response);
    expect(Url.findOne).toHaveBeenCalledWith({ where: { originalUrl: url } });
    expect(Url.create).not.toHaveBeenCalled();
  });

  it("should create a new URL entry if it doesn't exist in the database", async () => {
    Url.create.mockResolvedValueOnce(response);
    const result = await encodeUrl(url, host);

    expect(Url.findOne).toHaveBeenCalledWith({ where: { originalUrl: url } });
    expect(Url.create).toBeCalledTimes(1);
    expect(result).toEqual(response);
  });
});

describe("short-link decoder service test", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should return existing original URL if it already exists in the database", async () => {
    Url.findOne.mockResolvedValueOnce(response);

    const result = await decodeUrl(id);

    expect(result).toEqual(response);
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

describe("short-link visited update of existing url entry", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should update 'visited' in url entry if it exists in the database", async () => {
    Url.increment.mockResolvedValueOnce(response);

    const result = await updateVisits(id);

    expect(result).toBeUndefined();
    expect(Url.increment).toHaveReturned();
    expect(Url.increment).toHaveBeenCalledWith("visited", { where: { id } });
  });

  it("should be undefined because url entry does not exist in the database", async () => {
    Url.increment.mockRejectedValue();

    const result = await updateVisits(id);

    expect(result).toBeUndefined();
    expect(Url.increment).toHaveReturned();
    expect(Url.increment).toHaveBeenCalledWith("visited", { where: { id } });
  });
});

const url = "https://example.com/abc123h";
const id = "abc123ku8h";
const host = "localhost:3000";
const shortUrl = `http://${host}/${id}`;
const createdAt = Date.now();

const response = {
  id,
  originalUrl: url,
  shortUrl,
  visited: 0,
  createdAt,
};

module.exports = {
  url,
  id,
  host,
  shortUrl,
  response,
  createdAt,
};

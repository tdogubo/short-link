
# ShortLink

## Introduction
ShortLink is a simple project that allows the shortening of long URLs into more manageable links.
This API is built with JavaScript and provides endpoints for shortening URLs, retrieving original URLs from shortened links, statistics tracking and redirecting generated links to the originals.

## Features
- Shorten long URLs into shorter, more manageable links.
- Retrieve original URLs from shortened links.
- Track statistics such as the number of visits for each shortened link.

## Prerequisites
Node version >=12.0.0 and `npm` or `yarn` installed on your machine.

## Installation
#### 1. Clone this repository:

``` bash
git clone <repository-url>
```

#### 2. Navigate to project directory:

``` bash
cd short-link
```

#### 3. Install dependencies:

Using Yarn
``` bash 
yarn install
```
Using npm
``` bash yarn
npm install
```

## Usage

1. Start the server
``` bash
yarn start
```

2. The API will be available at http://localhost:3001 by default.

3. Use the following endpoints to interact with the API:

- POST /v1/urls/encode: Shorten a long URL. Provide the long URL in the request body.
- POST /v1/urls/decode: Retrieve the original URL associated with a shortened link.
- GET /v1/urls/:id/statics: Retrieve statistics for a shortened link, such as the number of visits.
- GET /:id : Redirects to the original link and increments the `visited` field of the url.

## Example

#### 1. Shorten URL
```bash
curl -H 'Content-Type: application/json' \
      -d '{"url": "https://example.com/"}' \
      -X POST \
      http://localhost:3001/v1/urls/encode
```
Response 
```json
{
    "data": {
        "original": "http://localhost:3001/Dz1dmlFKgZ"
    }
}
```

#### 2. Retrieve Original URL
```bash
curl -H 'Content-Type: application/json' \
      -d '{"url": "http://localhost:3001/Dz1dmlFKgZ"}' \
      -X POST \
      http://localhost:3001/v1/urls/decode
```
Response 
```json
{
    "data": {
        "original": "https://example.com/"
    }
}
```

#### 3. Get Stats on a URL
```bash
curl http://localhost:3001/v1/urls/Dz1dmlFKgZ/statics
```
Response 
```json
{
    "data": {
        "id": "Dz1dmlFKgZ",
        "originalUrl": "https://example.com/",
        "shortUrl": "http://localhost:3001/Dz1dmlFKgZ",
        "visited": 0,
        "createdAt": "2024-03-27T23:06:45.891Z"
    }
}
```
#### 4. To *visit* a url paste generated link in browser while server is still running.


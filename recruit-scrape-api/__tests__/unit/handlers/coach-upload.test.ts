import testUtils from "../test-utils"

import { handler } from '../../../src/handlers/coach-upload'

import {
  genericRequestContext,
  validPlainUploadBodyMock,
  validImageUploadBodyMock,
  missingFilenameMock,
  missingFileExtensionMock,
  invalidFileExtensionMock
} from '../fixtures/coach-upload-request'

describe('get-signed-url', () => {
  let S3Spy
  beforeEach(() => {
    S3Spy = testUtils.mockS3Upload({
      ETag: 'bleh',
      Key: 'doge.jpg',
      Bucket: 'testBucket',
      Location: 'https://s3bucket.doge.jpg'
    })
  });



  it('returns successful response with metadata upload', async () => {
    // Arrange
    const event = testUtils.constructAPIGwEvent({}, {
      method: 'POST',
      requestContext: genericRequestContext,
      body: JSON.stringify(validPlainUploadBodyMock)
    });

    // Act
    const result = await handler(event);

    // Assert
    expect(result).toEqual({
      statusCode: 200,
      body: expect.any(String)
    })
  });

  it('returns upload URL with valid image upload request', async () => {
    // Arrange
    const uploadURL = `https://s3bucket.doge.jpg`

    const event = testUtils.constructAPIGwEvent({}, {
      method: 'POST',
      requestContext: genericRequestContext,
      body: JSON.stringify(validImageUploadBodyMock)
    });

    // Act
    const result = await handler(event);

    // Assert
    expect(S3Spy).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      statusCode: 201,
      body: expect.any(String)
    })

    const parsedResultBody = JSON.parse(result.body)
    expect(parsedResultBody).toEqual({
      ETag: expect.any(String),
      Key: expect.any(String),
      Bucket: expect.any(String),
      Location: uploadURL
    })
  });

  describe(`request validation`, () => {
    it('returns 400 Bad Request with missing file name', async () => {
      // Arrange
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: {
          requestId: `testID`,
          accountId: `eafsdf`,
        },
        body: JSON.stringify(missingFilenameMock)
      });

      // Act
      const result = await handler(event);

      console.log(result)

      // Assert
      expect(S3Spy).toHaveBeenCalledTimes(0)
      expect(result).toEqual({
        statusCode: 400,
        body: expect.any(String)
      })

      const parsedResultBody = JSON.parse(result.body)
      expect(parsedResultBody).toEqual({
        message: "No file name specified"
      })
    });

    it('returns 400 error with missing file extension', async () => {
      // Arrange
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: {
          requestId: `testID`,
          accountId: `eafsdf`,
        },
        body: JSON.stringify(missingFileExtensionMock)
      });

      // Act
      const result = await handler(event);

      console.log(result)

      // Assert
      expect(S3Spy).toHaveBeenCalledTimes(0)
      expect(result).toEqual({
        statusCode: 400,
        body: expect.any(String)
      })

      const parsedResultBody = JSON.parse(result.body)
      expect(parsedResultBody).toEqual({
        message: "File Extension not specified"
      })
    });

    it('returns 400 error with invalid file extension', async () => {
      // Arrange
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: {
          requestId: `testID`,
          accountId: `eafsdf`,
        },
        body: JSON.stringify(invalidFileExtensionMock)
      });

      // Act
      const result = await handler(event);

      console.log(result)

      // Assert
      expect(S3Spy).toHaveBeenCalledTimes(0)
      expect(result).toEqual({
        statusCode: 400,
        body: expect.any(String)
      })

      const parsedResultBody = JSON.parse(result.body)
      expect(parsedResultBody).toEqual({
        message: "Invalid file extension"
      })
    });
  })
});
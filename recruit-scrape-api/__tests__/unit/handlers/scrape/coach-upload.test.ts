import testUtils from "../../test-utils"

import { handler } from '../../../../src/handlers/scrape/coach-upload'

import {
  genericRequestContext,
  validPlainUploadBodyMock,
  validImageUploadBodyMock,
  missingFilenameMock,
  missingFileExtensionMock,
  invalidFileExtensionMock
} from '../../fixtures/coach-upload-request'

import { basicCoachUploadPut } from '../../fixtures/coach-upload-dynamo-put-response'

describe('get-signed-url', () => {
  let S3Spy
  let dynamoSpy


  describe(`successful uploads`, () => {
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
      dynamoSpy = testUtils.mockDocumentClientPut(basicCoachUploadPut)
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: genericRequestContext,
        body: JSON.stringify(validPlainUploadBodyMock)
      });

      // Act
      const result = await handler(event);

      console.log(result)
      // Assert
      expect(result).toEqual({
        statusCode: 201,
        body: expect.any(String)
      })

      const { body } = result

      const parsedBody = JSON.parse(body)
      expect(parsedBody).toEqual({
        coachName: expect.any(String),
        school: expect.any(String),
        runID: expect.any(String),
        profilePictureURL: ""
      })
    });

    it('returns upload URL with valid image upload request', async () => {
      // Arrange
      const uploadURL = `https://s3bucket.doge.jpg`
      dynamoSpy = testUtils.mockDocumentClientPut(basicCoachUploadPut)
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
      console.log(parsedResultBody)
      expect(parsedResultBody).toEqual({
        coachName: expect.any(String),
        school: expect.any(String),
        runID: expect.any(String),
        profilePictureURL: uploadURL
      })
    });
  })

  describe(`s3 upload error`, () => {
    it(`returns a 500 code if there's an error uploading to dynamo`, async () => {
      dynamoSpy = testUtils.mockDocumentClientPut()
      S3Spy = testUtils.mockS3UploadError()

      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: genericRequestContext,
        body: JSON.stringify(validImageUploadBodyMock)
      });

      // Act
      const result = await handler(event);

      console.log(result)
      // Assert
      expect(result).toEqual({
        statusCode: 500,
        body: expect.any(String)
      })
    })
  })

  describe(`dynamo upload error`, () => {
    it(`returns a 500 code if there's an error uploading to dynamo`, async () => {
      dynamoSpy = testUtils.mockDocumentClientError()

      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: genericRequestContext,
        body: JSON.stringify(validPlainUploadBodyMock)
      });

      // Act
      const result = await handler(event);

      console.log(result)
      // Assert
      expect(result).toEqual({
        statusCode: 500,
        body: expect.any(String)
      })
    })
  })

  describe(`request validation`, () => {
    beforeEach(() => {
      dynamoSpy = testUtils.mockDocumentClientPut(basicCoachUploadPut)
      S3Spy = testUtils.mockS3Upload({
        ETag: 'bleh',
        Key: 'doge.jpg',
        Bucket: 'testBucket',
        Location: 'https://s3bucket.doge.jpg'
      })
    })
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
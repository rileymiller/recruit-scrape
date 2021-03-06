import testUtils from "../test-utils"

import { handler } from '../../../src/handlers/scrape-upload'

import {
  genericRequestContext,
  validPlainUploadBodyMock,
  validImageUploadBodyMock,
  missingFilenameMock,
  missingFileExtensionMock,
  invalidFileExtensionMock,
  validPlainUploadNoTitleBodyMock,
  validImageUploadNoTitleBodyMock
} from '../fixtures/coach-upload-request'

import { basicCoachUploadPut } from '../fixtures/coach-upload-dynamo-put-response'

describe('scrape-upload', () => {
  let S3Spy
  let dynamoPutSpy
  let dynamoGetSpy


  describe(`successful uploads`, () => {
    beforeEach(() => {
      S3Spy = testUtils.mockS3Upload({
        ETag: 'bleh',
        Key: 'doge.jpg',
        Bucket: 'testBucket',
        Location: 'https://s3bucket.doge.jpg'
      })
    });

    describe(`needs review`, () => {
      beforeEach(() => {
        dynamoGetSpy = testUtils.mockDocumentClientGet({})
        dynamoPutSpy = testUtils.mockDocumentClientPut(basicCoachUploadPut)
      })

      describe(`new upload`, () => {

        it(`returns successful response with new coach upload`, async () => {
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
            statusCode: 201,
            body: expect.any(String)
          })

          const { body } = result

          const parsedBody = JSON.parse(body)
          expect(parsedBody).toEqual({
            id: expect.any(String),
            coachName: expect.any(String),
            school: expect.any(String),
            runID: expect.any(String),
            needsReview: true,
            prodRecordExists: false,
            lastCheckedTime: expect.any(String),
            Title: expect.any(String)
          })
        });

        it('returns upload URL with new coach with profile picture upload', async () => {
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
            id: expect.any(String),
            coachName: expect.any(String),
            school: expect.any(String),
            runID: expect.any(String),
            profilePictureURL: uploadURL,
            needsReview: true,
            prodRecordExists: false,
            lastCheckedTime: expect.any(String),
            Title: expect.any(String)
          })
        });
      })

      describe(`record changed`, () => {
        beforeEach(() => {
          dynamoGetSpy = testUtils.mockDocumentClientGet()
          dynamoPutSpy = testUtils.mockDocumentClientPut(basicCoachUploadPut)
        })

        it(`returns successful response with new coach upload, request didn't match production record`, async () => {
          // Arrange
          const event = testUtils.constructAPIGwEvent({}, {
            method: 'POST',
            requestContext: genericRequestContext,
            body: JSON.stringify(validPlainUploadNoTitleBodyMock)
          });

          // Act
          const result = await handler(event);

          // Assert
          expect(result).toEqual({
            statusCode: 201,
            body: expect.any(String)
          })

          const { body } = result

          const parsedBody = JSON.parse(body)
          expect(parsedBody).toEqual({
            id: expect.any(String),
            coachName: expect.any(String),
            school: expect.any(String),
            runID: expect.any(String),
            needsReview: true,
            prodRecordExists: true,
            lastCheckedTime: expect.any(String),
          })
        });

        it(`returns upload URL with new coach with profile picture upload, request didn't production record`, async () => {
          // Arrange
          const uploadURL = `https://s3bucket.doge.jpg`

          const event = testUtils.constructAPIGwEvent({}, {
            method: 'POST',
            requestContext: genericRequestContext,
            body: JSON.stringify(validImageUploadNoTitleBodyMock)
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
            id: expect.any(String),
            coachName: expect.any(String),
            school: expect.any(String),
            runID: expect.any(String),
            profilePictureURL: uploadURL,
            needsReview: true,
            prodRecordExists: true,
            lastCheckedTime: expect.any(String),
          })
        });
      })

    })

    describe(`doesn't need review`, () => {
      beforeEach(() => {
        dynamoGetSpy = testUtils.mockDocumentClientGet()
        dynamoPutSpy = testUtils.mockDocumentClientPut(basicCoachUploadPut)
      })

      it(`returns successful response with new coach upload, request matched production record`, async () => {
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
          statusCode: 201,
          body: expect.any(String)
        })

        const { body } = result

        const parsedBody = JSON.parse(body)
        expect(parsedBody).toEqual({
          id: expect.any(String),
          coachName: expect.any(String),
          school: expect.any(String),
          runID: expect.any(String),
          needsReview: false,
          prodRecordExists: true,
          lastCheckedTime: expect.any(String),
          Title: expect.any(String)
        })
      });

      it('returns upload URL with new coach with profile picture upload, request matched production record', async () => {
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
          id: expect.any(String),
          coachName: expect.any(String),
          school: expect.any(String),
          runID: expect.any(String),
          profilePictureURL: uploadURL,
          needsReview: false,
          prodRecordExists: true,
          lastCheckedTime: expect.any(String),
          Title: expect.any(String)
        })
      });
    })
  })

  describe(`s3 upload error`, () => {
    it(`returns a 500 code if there's an error uploading to dynamo`, async () => {
      dynamoGetSpy = testUtils.mockDocumentClientGet()
      dynamoPutSpy = testUtils.mockDocumentClientPut()
      S3Spy = testUtils.mockS3UploadError()

      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: genericRequestContext,
        body: JSON.stringify(validImageUploadBodyMock)
      });

      // Act
      const result = await handler(event);

      // Assert
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: `Failed to upload coach profile picture to S3` })
      })
    })
  })

  describe(`dynamo fetch error`, () => {
    it(`returns a 500 code if there's an error fetching record from dynamo`, async () => {
      dynamoGetSpy = testUtils.mockDocumentClientGetError()
      dynamoPutSpy = testUtils.mockDocumentClientPut()

      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: genericRequestContext,
        body: JSON.stringify(validPlainUploadBodyMock)
      });

      // Act
      const result = await handler(event);

      // Assert
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: "Failed during Production item fetch" })
      })
    })
  })

  describe(`dynamo upload error`, () => {
    it(`returns a 500 code if there's an error uploading to dynamo`, async () => {
      dynamoGetSpy = testUtils.mockDocumentClientGet()
      dynamoPutSpy = testUtils.mockDocumentClientPutError()

      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: genericRequestContext,
        body: JSON.stringify(validPlainUploadBodyMock)
      });

      // Act
      const result = await handler(event);

      // Assert
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: `Failed to upload metadata to Dynamodb\n\"error\"` })
      })
    })
  })

  describe(`request validation`, () => {
    beforeEach(() => {
      dynamoGetSpy = testUtils.mockDocumentClientGet()
      dynamoPutSpy = testUtils.mockDocumentClientPut(basicCoachUploadPut)
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
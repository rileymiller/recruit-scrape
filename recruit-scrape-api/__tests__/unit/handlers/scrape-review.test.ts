import testUtils from "../test-utils"

import { handler } from '../../../src/handlers/scrape-review'

import {
  genericRequestContext,
  validPlainUploadBodyMock,
} from '../fixtures/coach-upload-request'

import { basicCoachUploadPut } from '../fixtures/coach-upload-dynamo-put-response'
import { basicCoachReviewScan } from "../fixtures/scrape-dynamo-scan-response"

describe('scrape-upload', () => {
  let dynamoScanSpy


  describe(`successful fetch`, () => {
    beforeEach(() => {
      dynamoScanSpy = testUtils.mockDocumentClientScan(basicCoachReviewScan)
    });

    it(`fetches items marked with needsReview`, async () => {
      // Arrange
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'GET',
        requestContext: genericRequestContext,
        body: JSON.stringify(basicCoachReviewScan)
      });

      // Act
      const result = await handler(event);

      console.log(result)
      // Assert
      expect(result).toEqual({
        statusCode: 200,
        body: expect.any(String)
      })

      const { body } = result

      const parsedBody = JSON.parse(body)
      expect(parsedBody).toEqual({
        coaches: [{
          id: expect.any(String),
          coachName: expect.any(String),
          lastCheckedTime: expect.any(String),
          needsReview: true,
          prodRecordExists: false,
          school: expect.any(String),
          runID: expect.any(String),
          Title: expect.any(String)
        }]
      })
    });

    // it('creates new production record with profile picture', async () => {
    //   // Arrange
    //   const event = testUtils.constructAPIGwEvent({}, {
    //     method: 'POST',
    //     requestContext: genericRequestContext,
    //     body: JSON.stringify(validImageUploadedBodyMock)
    //   });

    //   // Act
    //   const result = await handler(event);

    //   // Assert
    //   expect(result).toEqual({
    //     statusCode: 201,
    //     body: expect.any(String)
    //   })

    //   const parsedResultBody = JSON.parse(result.body)
    //   expect(parsedResultBody).toEqual({
    //     id: expect.any(String),
    //     coachName: expect.any(String),
    //     school: expect.any(String),
    //     runID: expect.any(String),
    //     profilePictureURL: expect.any(String),
    //     Title: expect.any(String)
    //   })
    // });
  })

  describe(`dynamo scan error`, () => {
    it(`returns a 500 code if there's an error scanning for needsReview`, async () => {
      dynamoScanSpy = testUtils.mockDocumentClientScanError()

      const event = testUtils.constructAPIGwEvent({}, {
        method: 'GET',
        requestContext: genericRequestContext,
        body: JSON.stringify(validPlainUploadBodyMock)
      });

      // Act
      const result = await handler(event);

      console.log(result)
      // Assert
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: `Failed to fetch review items from Dynamodb\n\"error\"` })
      })
    })
  })
})


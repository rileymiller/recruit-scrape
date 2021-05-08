import testUtils from "../test-utils"

import { handler } from '../../../src/handlers/coach-update'

import {
  genericRequestContext,
  validPlainUploadBodyMock,
  validImageUploadBodyMock,
  validImageUploadedBodyMock,
} from '../fixtures/coach-upload-request'

import { basicCoachUploadPut } from '../fixtures/coach-upload-dynamo-put-response'

describe('scrape-upload', () => {
  let dynamoPutSpy


  describe(`successful uploads`, () => {
    beforeEach(() => {
      dynamoPutSpy = testUtils.mockDocumentClientPut(basicCoachUploadPut)
    });

    it(`creates new production record`, async () => {
      // Arrange
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
        id: expect.any(String),
        coachName: expect.any(String),
        school: expect.any(String),
        runID: expect.any(String),
        Title: expect.any(String)
      })
    });

    it('creates new production record with profile picture', async () => {
      // Arrange
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'POST',
        requestContext: genericRequestContext,
        body: JSON.stringify(validImageUploadedBodyMock)
      });

      // Act
      const result = await handler(event);

      // Assert
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
        profilePictureURL: expect.any(String),
        Title: expect.any(String)
      })
    });
  })

  describe(`dynamo upload error`, () => {
    it(`returns a 500 code if there's an error uploading to dynamo`, async () => {
      dynamoPutSpy = testUtils.mockDocumentClientPutError()

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
        body: JSON.stringify({ message: `Failed to upload metadata to Dynamodb\n\"error\"` })
      })
    })
  })
})


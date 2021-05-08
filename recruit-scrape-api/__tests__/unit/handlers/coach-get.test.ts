import testUtils from "../test-utils"

import { handler } from '../../../src/handlers/coach-get'

import {
  genericRequestContext,
} from '../fixtures/coach-upload-request'


describe('scrape-upload', () => {
  let dynamoGetSpy


  describe(`successful fetch`, () => {
    beforeEach(() => {
      dynamoGetSpy = testUtils.mockDocumentClientGet()
    });

    it(`fetches item by id`, async () => {
      // Arrange
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'GET',
        requestContext: genericRequestContext,
        pathParameters: {
          id: `Urban Meyer-Florida University`
        }
      });

      // Act
      const result = await handler(event);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
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

    it(`fetches item by id while escaped`, async () => {
      // Arrange
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'GET',
        requestContext: genericRequestContext,
        pathParameters: {
          id: `Urban%Meyer-Florida%University`
        }
      });

      // Act
      const result = await handler(event);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
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
  })

  describe(`parameter invalid error`, () => {
    beforeEach(() => {
      dynamoGetSpy = testUtils.mockDocumentClientGet()
    });

    it(`fetches item by id`, async () => {
      // Arrange
      const event = testUtils.constructAPIGwEvent({}, {
        method: 'GET',
        requestContext: genericRequestContext,
      });

      // Act
      const result = await handler(event);

      // Assert
      expect(result).toEqual({
        statusCode: 400,
        body: expect.any(String)
      })
    });
  })

  describe(`dynamo get error`, () => {
    it(`returns a 500 code if there's an error fetching item from dynamo by id`, async () => {
      dynamoGetSpy = testUtils.mockDocumentClientGetError()

      const event = testUtils.constructAPIGwEvent({}, {
        method: 'GET',
        requestContext: genericRequestContext,
        pathParameters: {
          id: `Urban%Meyer-Florida%University`
        }
      });

      // Act
      const result = await handler(event);

      // Assert
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: `Failed to fetch coach by id from Dynamodb\n\"error\"` })
      })
    })
  })
})


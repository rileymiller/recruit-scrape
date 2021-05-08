import AWS, { DynamoDB } from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import {
  log,
  badRequestResponse,
  serverErrorResponse,
} from '../utils'
import { succesfulResponse } from '../utils/response-factories'

AWS.config.update({ region: process.env.AWS_REGION })

const dynamoClient = new DynamoDB.DocumentClient()

const COACH_SCRAPE_TABLE = process.env.ScrapeUploadTable

// Main Lambda entry point
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // fetch the item record
    const scanReviewItems: DynamoDB.DocumentClient.ScanInput = {
      TableName: COACH_SCRAPE_TABLE,
      FilterExpression: "needsReview = :v1",
      ExpressionAttributeValues: {
        ":v1": true
      },
      ReturnConsumedCapacity: "TOTAL"

    }
    const result = await dynamoClient.scan(scanReviewItems).promise();

    return succesfulResponse({
      coaches: result.Items
    })
  } catch (e) {
    return serverErrorResponse(new Error(`Failed to fetch review items from Dynamodb\n${JSON.stringify(e)}`))
  }
}

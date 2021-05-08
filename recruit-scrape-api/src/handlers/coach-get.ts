import AWS, { DynamoDB } from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { unescape } from 'querystring'

import {
  log,
  badRequestResponse,
  serverErrorResponse,
} from '../utils'
import { succesfulResponse } from '../utils/response-factories'

AWS.config.update({ region: process.env.AWS_REGION })

const dynamoClient = new DynamoDB.DocumentClient()

const COACH_PROD_TABLE = process.env.CoachProdTable

// Main Lambda entry point
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // get the coach id from the path parameter
    const rawID = event.pathParameters?.id

    if (!rawID) {
      return badRequestResponse(new Error(`id not specified`))
    }

    const id = unescape(rawID)

    // fetch the item record
    const getItemParams: DynamoDB.DocumentClient.GetItemInput = {
      TableName: COACH_PROD_TABLE,
      Key: {
        id: id
      }
    }

    const result = await dynamoClient.get(getItemParams).promise()

    return succesfulResponse(result.Item)
  } catch (e) {
    return serverErrorResponse(new Error(`Failed to fetch coach by id from Dynamodb\n${JSON.stringify(e)}`))
  }
}

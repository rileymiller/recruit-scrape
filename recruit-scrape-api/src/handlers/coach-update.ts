import AWS, { DynamoDB } from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import {
  log,
  badRequestResponse,
  serverErrorResponse,
  getCurrentTimeString
} from '../utils'
import { successfulDynamoPutResponse } from '../utils/response-factories'

AWS.config.update({ region: process.env.AWS_REGION })

const dynamoClient = new DynamoDB.DocumentClient()

const COACH_PROD_TABLE = process.env.CoachProdTable

/**
 * The expected request structure of an image upload request object
 */
export type CoachUploadRequestBody = {
  key: string
  coachName: string
  conference: string
  division: string
  sport: string
  gender: string
  school: string
  profilePictureURL?: string
  [key: string]: string
}

// Main Lambda entry point
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  let body: CoachUploadRequestBody

  try {
    body = JSON.parse(event.body || `{}`)
  } catch (e) {
    return badRequestResponse(new Error(`Request Serialization Error`))
  }

  try {
    validateCoachUploadRequestBody(body)
  } catch (e) {
    return badRequestResponse(e)
  }

  const { key, ...metadata } = body

  const coachKey = key

  const metadataUploadParams: CoachMetaDataUploadRequest = getCoachUploadRequest(coachKey, metadata)

  try {
    const result = await dynamoClient.put(metadataUploadParams).promise();

    // not the result here will be the attributes on the old item
    log(`DEBUG`, `result: ${JSON.stringify(result)}`)

    return successfulDynamoPutResponse({
      ...metadataUploadParams.Item
    })
  } catch (e) {
    return serverErrorResponse(new Error(`Failed to upload metadata to Dynamodb\n${JSON.stringify(e)}`))
  }
}


type CoachMetaDataUploadRequest = {
  TableName: string
  Item: {
    id: string
    [key: string]: any
  }
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property put only recognizes 'NONE' | 'ALL_OLD'
  ReturnValues: 'NONE' | 'ALL_OLD'
}

type CoachMetadata = { [key: string]: any }

const getCoachUploadRequest = (coachKey: string, metadata: CoachMetadata): CoachMetaDataUploadRequest => (
  {
    TableName: COACH_PROD_TABLE,
    Item: {
      id: coachKey,
      ...metadata,
      lastUpdated: getCurrentTimeString()
    },
    ReturnValues: 'ALL_OLD'
  }
)

const validateCoachUploadRequestBody = (body: CoachUploadRequestBody) => {
  const { key, coachName, division, conference, school, sport, gender } = body

  if (!key) {
    throw new Error(`key unset in request`)
  }

  if (!coachName) {
    throw new Error(`coachName unset in request`)
  }

  if (!division) {
    throw new Error(`division unset in request`)
  }

  if (!conference) {
    throw new Error(`conference unset in request`)
  }

  if (!school) {
    throw new Error(`school unset in request`)
  }

  if (!sport) {
    throw new Error(`sport unset in request`)
  }

  if (!gender) {
    throw new Error(`gender unset in request`)
  }
}

import AWS, { DynamoDB } from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import {
  log,
  badRequestResponse,
  serverErrorResponse,
} from '../utils'
import { successfulDynamoPutResponse } from '../utils/response-factories'

AWS.config.update({ region: process.env.AWS_REGION })

const dynamoClient = new DynamoDB.DocumentClient()


const COACH_PROD_TABLE = process.env.CoachProdTable

/**
 * The expected request structure of an image upload request object
 */
export type CoachUploadRequestBody = {
  coachName: string
  school: string
  runID: string
  profilePictureURL?: string
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

  // pull out filename so it's not upload with the coach metadata
  const { ...metadata } = body

  const coachKey = getDynamoUploadKey(body)

  const metadataUploadParams: CoachMetaDataUploadRequest = getCoachUploadRequest(coachKey, metadata)

  try {
    log(`DEBUG`, `medataUploadParams:${JSON.stringify(metadataUploadParams)}`)

    const result = await dynamoClient.put(metadataUploadParams).promise();

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
}

type CoachMetadata = { [key: string]: any }

const getCoachUploadRequest = (coachKey: string, metadata: CoachMetadata): CoachMetaDataUploadRequest => (
  {
    TableName: COACH_PROD_TABLE,
    Item: {
      id: coachKey,
      ...metadata,
    }
  }
)

const getDynamoUploadKey = (body: CoachUploadRequestBody) => `${body.coachName}-${body.school}`

const validateCoachUploadRequestBody = (body: CoachUploadRequestBody) => {
  const { coachName, school, runID } = body

  if (!coachName) {
    throw new Error(`coachName unset in request`)
  }

  if (!school) {
    throw new Error(`school unset in request`)
  }

  if (!runID) {
    throw new Error(`runID unset in request`)
  }
}

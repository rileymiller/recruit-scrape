import AWS, { S3, DynamoDB } from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { isEmpty } from 'lodash'

import {
  log,
  badRequestResponse,
  succesfulS3UploadResponse,
  serverErrorResponse,
  getImageExtAndMimeType,
  decodeImage,
  succesfulResponse,
  uploadImageToS3
} from '../../utils'
import { successfulDynamoPutResponse } from '../../utils/response-factories'

AWS.config.update({ region: process.env.AWS_REGION })

const s3 = new S3()
const dynamoClient = new DynamoDB.DocumentClient()


const COACH_IMAGE_UPLOAD_BUCKET = process.env.UploadBucket
const COACH_SCRAPE_UPLOAD_TABLE = process.env.ScrapeUploadTable
const COACH_PROD_TABLE = process.env.CoachProdTable

/**
 * The expected request structure of an image upload request object
 */
export type CoachUploadRequestBody = {
  coachName: string
  school: string
  runID: string
  fileName?: string
  profilePictureBase64?: string
}

// Main Lambda entry point
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!COACH_IMAGE_UPLOAD_BUCKET) {
    return badRequestResponse(new Error(`S3 Bucket environment variable unset`))
  }

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
  const { profilePictureBase64, fileName, ...metadata } = body

  const coachKey = getDynamoUploadKey(body)

  let needsReview = false
  // check if the record exists in COACH_PROD_TABLE ✅
  // - if it does, compare it with upload fields to see if anything is different
  //    - if the attributes are different, mark the scrape upload as needs_review
  //    - else, update the attribute in the scrape table with a timestamp for last_check
  // - else upload to the scrape table and mark as needs_review ✅
  try {

    // fetch the item record, nothing should exist at this time
    const getItemParams = {
      TableName: COACH_SCRAPE_UPLOAD_TABLE,
      Key: {
        id: coachKey
      }
    }


    const result = dynamoClient.get(getItemParams).promise()

    if (isEmpty(result)) {
      log(`INFO`, `response was empty`)
      needsReview = true
    } else {
      log(`INFO`, `response returned`)
    }


  } catch (e) {
    return serverErrorResponse(e)
  }

  // upload profile image to S3 if it exists
  let imageUploadResponse: S3.ManagedUpload.SendData
  if (profilePictureBase64) {
    let s3CoachUploadRequestParameters: S3CoachUploadRequest

    try {
      const { profilePictureBase64, fileName, coachName, school, runID } = body

      s3CoachUploadRequestParameters = createS3CoachUploadRequest(profilePictureBase64, fileName, coachName, school, runID)
    } catch (e) {
      return badRequestResponse(e)
    }

    try {
      imageUploadResponse = await handleImageUpload(s3CoachUploadRequestParameters)
    } catch (e) {
      return serverErrorResponse(new Error(`Failed to upload coach profile picture to S3`))
    }
  }



  const imageLocation = imageUploadResponse?.Location ? imageUploadResponse?.Location : ''
  const metadataUploadParams: CoachMetaDataUploadRequest = getCoachUploadRequest(coachKey, metadata, needsReview, imageLocation)

  try {

    const result = await dynamoClient.put(metadataUploadParams).promise();

    return successfulDynamoPutResponse({
      ...metadataUploadParams.Item
    })
  } catch (e) {
    return serverErrorResponse(new Error(`Failed to upload metadata to Dynamodb\n${JSON.stringify(e)}`))
  }
}

const getCurrentTimeString = () => new Date().toISOString()

type CoachMetaDataUploadRequest = {
  TableName: string
  Item: {
    id: string
    [key: string]: any
    needsReview: boolean
    profilePictureURL?: string
    lastCheckedTime: string
  }
}

type CoachMetadata = { [key: string]: any }

const getCoachUploadRequest = (coachKey: string, metadata: CoachMetadata, needsReview: boolean, imageLocation?: string): CoachMetaDataUploadRequest => (
  imageLocation ? {
    TableName: COACH_SCRAPE_UPLOAD_TABLE,
    Item: {
      id: coachKey,
      ...metadata,
      profilePictureURL: imageLocation,
      needsReview,
      lastCheckedTime: getCurrentTimeString()
    }
  }
    : {
      TableName: COACH_SCRAPE_UPLOAD_TABLE,
      Item: {
        id: coachKey,
        ...metadata,
        needsReview,
        lastCheckedTime: getCurrentTimeString()
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

const handleImageUpload = async (s3CoachUploadRequestParameters: S3CoachUploadRequest) => {

  const s3UploadResponse = await uploadImageToS3(s3, s3CoachUploadRequestParameters)

  return s3UploadResponse
}

type S3CoachUploadRequest = {
  Body: Buffer
  Bucket: string
  ContentType: string
  Key: string
  ACL: string
}

const createS3CoachUploadRequest = (
  profilePictureBase64: string,
  fileName: string,
  coachName: string,
  school: string,
  runID: string
): S3CoachUploadRequest => {
  let { imageExtension, imageMimeType } = getImageExtAndMimeType(fileName)

  const Key = constructS3UploadKey(coachName, school, runID, imageExtension)

  const decodedImage = decodeImage(profilePictureBase64)

  const s3CoachUploadRequestParameters = {
    Body: decodedImage,
    Bucket: COACH_IMAGE_UPLOAD_BUCKET,
    ContentType: imageMimeType,
    Key,

    // This ACL makes the uploaded object publicly readable.
    ACL: 'public-read'
  }

  let { Body, ...paramMetadata } = s3CoachUploadRequestParameters

  log(`INFO`, `S3 Coach Upload Request Parameters: ${JSON.stringify(paramMetadata)}`)

  return s3CoachUploadRequestParameters
}

const constructS3UploadKey = (coachName: string, school: string, runID: string, imageExtension: string) =>
  `${coachName}-${school}-${runID}${imageExtension}`

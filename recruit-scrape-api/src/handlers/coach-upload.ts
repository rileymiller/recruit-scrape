import AWS, { S3 } from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {
  log,
  badRequestResponse,
  succesfulS3UploadResponse,
  getImageExtAndMimeType,
  decodeImage,
  succesfulResponse,
  uploadImageToS3
} from '../utils'

AWS.config.update({ region: process.env.AWS_REGION })

const s3 = new S3()

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

const COACH_IMAGE_UPLOAD_BUCKET = process.env.UploadBucket

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

  const { profilePictureBase64, ...metadata } = body

  if (profilePictureBase64) {
    return await handleImageUpload(body)
  } else {
    // TODO-rsm process plain metadata upload
    return succesfulResponse()
  }
}

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

const handleImageUpload = async (body: CoachUploadRequestBody) => {
  const { profilePictureBase64, fileName, coachName, school, runID } = body

  try {
    const s3CoachUploadRequestParameters = createS3CoachUploadRequest(profilePictureBase64, fileName, coachName, school, runID)

    const s3UploadResponse = await uploadImageToS3(s3, s3CoachUploadRequestParameters)

    return succesfulS3UploadResponse(s3UploadResponse)
  } catch (e) {
    return badRequestResponse(e)
  }
}

const createS3CoachUploadRequest = (
  profilePictureBase64: string,
  fileName: string,
  coachName: string,
  school: string,
  runID: string
) => {
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

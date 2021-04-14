import AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import mime from 'mime-types'

AWS.config.update({ region: process.env.AWS_REGION })

const s3 = new AWS.S3()

type LogImportance = 'INFO' | 'DEBUG' | 'ERROR'


/**
 * Type guard for debug level logging
 * 
 * @param importance importance of log ("INFO", "DEBUG", "ERROR")
 * @returns 
 */
const isDebug = (importance: LogImportance): importance is 'DEBUG' => {
  if ((importance as 'DEBUG')) {
    return true
  } else {
    return false
  }
}

/**
 * 
 * @param importance importance of log ("INFO", "DEBUG", "ERROR")
 * @param message 
 * @param date 
 */
function log(importance?: LogImportance, message?: string, date: Date = new Date()) {
  if (isDebug(importance)) {
    console.debug(`[${date.toLocaleString(`en-US`, { timeZone: `America/Denver` })}] [${importance}] ${message}`)
  } else {
    console.log(`[${date.toLocaleString(`en-US`, { timeZone: `America/Denver` })}] [${importance}] ${message}`)
  }
}

/**
 * Returns a 400 Bad Response to the client.
 * 
 * @param error error thrown by bad request format
 * @returns 
 */
const badRequest = (error: Error) => {
  log("ERROR", error.message)
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: error.message
    })
  }
}

/**
 * Returns a successful response with S3 upload metadata to the client.
 * 
 * @param s3UploadResponse response from uploading object to S3 bucket
 * @returns API Gateway response
 */
const succesfulS3Upload = (s3UploadResponse: AWS.S3.ManagedUpload.SendData) => {
  log(`DEBUG`, JSON.stringify(s3UploadResponse))

  return {
    statusCode: 201,
    body: JSON.stringify({
      ...s3UploadResponse
    })
  }
}

/**
 * Grabs the extension from the passed file name
 * 
 * @param filename of base 64 image
 * @returns 
 */
const getFileExtension = (filename: string) => {
  if (!filename) {
    throw new Error(`No file name specified`)
  }

  if (-1 === filename.indexOf('.')) {
    throw new Error(`File Extension not specified`)
  }

  return filename.substr(filename.indexOf('.'))
}

/**
 * The expected request structure of an image upload request object
 */
export type CoachUploadRequestBody = {
  fileName: string
  coachName: string
  profilePictureBase64: string
  school: string
  runID: string
}

/**
 * Returns the user-specified file extension and the calculated
 * mime-type.
 *  
 * @param fileName the image file name
 * @returns 
 */
const getExtensionAndMimeType = (fileName: string) => {
  const imageExtension = getFileExtension(fileName)

  const imageMimeType = mime.lookup(imageExtension)

  if (!imageMimeType) {
    throw new Error('Invalid file extension')
  }

  return { imageExtension, imageMimeType }
}

const uploadImageToS3 = async (uploadParams: AWS.S3.PutObjectRequest) => {
  return await s3.upload(uploadParams).promise()
}

const decodeImage = (base64Image: string) => Buffer.from(base64Image, `base64`)

const validateRequestBody = (body: CoachUploadRequestBody) => {
  const { fileName, profilePictureBase64, coachName, school, runID } = body

  if (!fileName) {
    throw new Error(`fileName unset in request`)
  }

  if (!profilePictureBase64) {
    throw new Error(`profilePictureBase64 unset in request`)
  }

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

// Main Lambda entry point
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const uploadBucket = process.env.UploadBucket

  if (!uploadBucket) {
    return badRequest(new Error(`UploadBucket environment variable unset`))
  }

  let body: CoachUploadRequestBody
  try {
    body = JSON.parse(event.body || `{}`)
  } catch (e) {
    return badRequest(new Error(`Request Serialization Error`))
  }

  try {
    validateRequestBody(body)
  } catch (e) {
    return badRequest(e)
  }

  const { fileName, profilePictureBase64, coachName, school, runID } = body

  const decodedImage = decodeImage(profilePictureBase64)

  let imageExtension
  let imageMimeType

  try {
    const imageMetadata = getExtensionAndMimeType(fileName)

    imageExtension = imageMetadata.imageExtension

    imageMimeType = imageMetadata.imageMimeType
  } catch (e) {
    return badRequest(e)
  }

  try {
    const Key = `${coachName}-${school}-${runID}${imageExtension}`

    const uploadParams = {
      Body: decodedImage,
      Bucket: uploadBucket,
      ContentType: imageMimeType,
      Key,

      // This ACL makes the uploaded object publicly readable.
      ACL: 'public-read'
    }

    let { Body, ...paramMetadata } = uploadParams
    log(`INFO`, `S3 Upload Params: ${JSON.stringify(paramMetadata)}`)

    const s3UploadResponse = await uploadImageToS3(uploadParams)

    return succesfulS3Upload(s3UploadResponse)
  } catch (e) {
    return badRequest(e)
  }
}

import { log } from '../utils'


/**
 * Returns a 400 Bad Response to the client.
 * 
 * @param error error thrown by bad request format
 * @returns 
 */
export const badRequestResponse = (error: Error) => {
  log("ERROR", error.message)
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: error.message
    })
  }
}

/**
 * Returns a 500 error to the client, indicating there was a server error.
 * 
 * @param error error thrown by bad request format
 * @returns 
 */
export const serverErrorResponse = (error: Error) => {
  log("ERROR", error.message)
  return {
    statusCode: 500,
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
export const succesfulS3UploadResponse = (s3UploadResponse: AWS.S3.ManagedUpload.SendData) => {
  log(`DEBUG`, JSON.stringify(s3UploadResponse))

  return {
    statusCode: 201,
    body: JSON.stringify({
      ...s3UploadResponse
    })
  }
}

export const successfulDynamoPutResponse = (body) => {
  log(`INFO`, `Upload Successful`)

  return {
    statusCode: 201,
    body: JSON.stringify(body)
  }
}

export const succesfulResponse = (body?: any) => {
  log(`INFO`, `Success`)

  return {
    statusCode: 200,
    body: body ? JSON.stringify(body) : JSON.stringify({
      message: `Success`
    }),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  }
}
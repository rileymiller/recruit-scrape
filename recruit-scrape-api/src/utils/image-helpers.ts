import mime from 'mime-types'
import { S3 } from 'aws-sdk'

export const getImageExtAndMimeType = (fileName: string) => {
  const imageMetadata = getExtensionAndMimeType(fileName)

  const imageExtension = imageMetadata.imageExtension

  const imageMimeType = imageMetadata.imageMimeType

  return { imageExtension, imageMimeType }
}

export const getFileExtension = (filename: string) => {
  if (!filename) {
    throw new Error(`No file name specified`)
  }

  if (-1 === filename.indexOf('.')) {
    throw new Error(`File Extension not specified`)
  }

  return filename.substr(filename.indexOf('.'))
}

export const getExtensionAndMimeType = (fileName: string) => {
  const imageExtension = getFileExtension(fileName)

  const imageMimeType = mime.lookup(imageExtension)

  if (!imageMimeType) {
    throw new Error('Invalid file extension')
  }

  return { imageExtension, imageMimeType }
}

export const uploadImageToS3 = async (s3: S3, uploadParams: S3.PutObjectRequest) => {
  return await s3.upload(uploadParams).promise()
}

export const decodeImage = (base64Image: string) => Buffer.from(base64Image, `base64`)

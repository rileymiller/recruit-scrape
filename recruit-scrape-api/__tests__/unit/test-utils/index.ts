import { mockS3Upload, mockS3UploadError } from './s3-helpers'
import { mockDocumentClientPut, mockDocumentClientGet, mockDocumentClientError } from './dynamo-helpers'
import { constructAPIGwEvent } from './api-gateway-helpers'

export const testUtils = {
  mockS3Upload,
  mockS3UploadError,
  mockDocumentClientPut,
  mockDocumentClientGet,
  mockDocumentClientError,
  constructAPIGwEvent
}

export default testUtils
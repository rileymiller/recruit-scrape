import { mockS3Upload, mockS3UploadError } from './s3-helpers'
import {
  mockDocumentClientPut,
  mockDocumentClientGet,
  mockDocumentClientPutError,
  mockDocumentClientGetError,
  mockDocumentClientScanError,
  mockDocumentClientScan
} from './dynamo-helpers'
import { constructAPIGwEvent } from './api-gateway-helpers'

export const testUtils = {
  mockS3Upload,
  mockS3UploadError,
  mockDocumentClientPut,
  mockDocumentClientGet,
  mockDocumentClientGetError,
  mockDocumentClientPutError,
  mockDocumentClientScanError,
  mockDocumentClientScan,
  constructAPIGwEvent
}

export default testUtils
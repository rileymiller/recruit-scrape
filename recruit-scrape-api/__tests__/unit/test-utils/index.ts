import { mockS3Upload } from './s3-helpers'
import { constructAPIGwEvent } from './api-gateway-helpers'

export const testUtils = {
  mockS3Upload,
  constructAPIGwEvent
}

export default testUtils
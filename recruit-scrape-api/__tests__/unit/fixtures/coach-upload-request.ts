import { CoachUploadRequestBody } from '../../../src/handlers/scrape-upload'
import { base64EncodeImage } from './convert-to-base-64-fixture'

export const genericRequestContext = {
  requestId: `testID`,
  accountId: `eafsdf`,
}

export const validPlainUploadBodyMock: CoachUploadRequestBody = {
  coachName: `Urban Meyer`,
  school: `Florida University`,
  Title: `Head Coach`,
  runID: `abc123`
}

export const validPlainUploadNoTitleBodyMock: CoachUploadRequestBody = {
  coachName: `Urban Meyer`,
  school: `Florida University`,
  runID: `abc123`
}

export const validImageUploadBodyMock: CoachUploadRequestBody = {
  coachName: `Urban Meyer`,
  school: `Florida University`,
  Title: `Head Coach`,
  runID: `abc123`,
  profilePictureBase64: base64EncodeImage(`coach.jpeg`),
  fileName: `coach.jpeg`
}

export const validImageUploadNoTitleBodyMock: CoachUploadRequestBody = {
  coachName: `Urban Meyer`,
  school: `Florida University`,
  runID: `abc123`,
  profilePictureBase64: base64EncodeImage(`coach.jpeg`),
  fileName: `coach.jpeg`
}

export const missingFilenameMock: Omit<CoachUploadRequestBody, 'fileName'> = {
  coachName: `Urban Meyer`,
  school: `Florida University`,
  runID: `abc123`,
  profilePictureBase64: base64EncodeImage(`coach.jpeg`),
}

export const missingFileExtensionMock: CoachUploadRequestBody = {
  coachName: `Urban Meyer`,
  school: `Florida University`,
  runID: `abc123`,
  profilePictureBase64: base64EncodeImage(`coach.jpeg`),
  fileName: `coach`
}

export const invalidFileExtensionMock: CoachUploadRequestBody = {
  coachName: `Urban Meyer`,
  school: `Florida University`,
  runID: `abc123`,
  profilePictureBase64: base64EncodeImage(`coach.jpeg`),
  fileName: `coach.doge`
}
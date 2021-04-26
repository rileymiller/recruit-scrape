import { S3 } from 'aws-sdk'

export function mockS3Upload(res: S3.ManagedUpload.SendData) {
  const mockS3 = jest.spyOn(S3.prototype, 'upload')
  mockS3.mockReturnValue({
    promise: jest.fn().mockImplementationOnce(() => ({ ...res })),
    abort: jest.fn(),
    send: jest.fn(),
    on: jest.fn()
  })
  return mockS3
}

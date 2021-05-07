import { DynamoDB } from 'aws-sdk'
import { basicCoachUploadPut } from '../fixtures/coach-upload-dynamo-put-response'
import { basicCoachGet } from '../fixtures/coach-upload-dynamo-get-response'

const mockDate = new Date(1997, 4, 3)

const baseDynamoMock = {
  abort: jest.fn(),
  send: jest.fn(),
  on: jest.fn(),
  createReadStream: jest.fn(),
  eachPage: jest.fn(),
  isPageable: jest.fn(),
  onAsync: jest.fn(),
  startTime: mockDate,
  httpRequest: {
    path: '/mock/upload',
    pathname: () => 'uploadPath',
    search: 'mockSearch',
    body: 'body',
    endpoint: {
      host: 'mock',
      hostname: 'mock',
      href: 'mock',
      port: 80,
      protocol: 'tcp'
    },
    headers: {},
    method: 'POST'
  }
}

export function mockDocumentClientPut(res: DynamoDB.DocumentClient.PutItemOutput = basicCoachUploadPut) {
  const mockDocumentClient = jest.spyOn(DynamoDB.DocumentClient.prototype, 'put')

  mockDocumentClient.mockReturnValue({
    promise: jest.fn().mockImplementationOnce(() => ({ ...res })),
    ...baseDynamoMock
  })
  return mockDocumentClient
}

export function mockDocumentClientGet(res: DynamoDB.DocumentClient.GetItemOutput = basicCoachGet) {
  const mockDocumentClient = jest.spyOn(DynamoDB.DocumentClient.prototype, 'get')

  mockDocumentClient.mockReturnValue({
    promise: jest.fn().mockImplementationOnce(() => ({ ...res })),
    ...baseDynamoMock
  })
  return mockDocumentClient
}

export function mockDocumentClientError() {
  const mockDocumentClient = jest.spyOn(DynamoDB.DocumentClient.prototype, 'put')

  mockDocumentClient.mockReturnValue({
    promise: jest.fn().mockImplementationOnce(() => { return Promise.reject('error') }),
    ...baseDynamoMock
  })
  return mockDocumentClient
}


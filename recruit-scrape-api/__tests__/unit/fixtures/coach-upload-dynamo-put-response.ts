import { DynamoDB } from 'aws-sdk'

export const basicCoachUploadPut: DynamoDB.DocumentClient.PutItemOutput = {
  Attributes: {
    id: `Urban Meyer-Florida University`,
    Title: `Head Coach`,
    coachName: `Urban Meyer`,
    conference: `SEC`,
    division: `d1`,
    gender: `Mens`,
    profilePictureURL: `https://coach-scrape-bucket-mock.s3.amazonaws.com/UrbanMeyer.png`,
    runID: `8f10b1b3-21f7-4362-be4a-ed2b9bc7d563`,
    school: `Florida University`,
    sport: `Football`,
    email: `urban@florida.edu`,
    phone: `3032223456`,
  },
  ConsumedCapacity: {},
  ItemCollectionMetrics: {}
}

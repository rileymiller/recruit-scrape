import { DynamoDB } from 'aws-sdk'

export const basicCoachGet: DynamoDB.DocumentClient.GetItemOutput = {
  Item: {
    coachName: `Urban Meyer`,
    Title: `Head Coach`,
    school: `Florida University`,
    id: `Urban Meyer-Florida University`,
    runID: `8f10b1b3-21f7-4362-be4a-ed2b9bc7d563`
  }
}
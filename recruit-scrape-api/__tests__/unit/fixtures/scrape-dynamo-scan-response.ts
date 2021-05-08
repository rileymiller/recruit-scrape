import { DynamoDB } from 'aws-sdk'

export const basicCoachReviewScan: DynamoDB.DocumentClient.ScanOutput = {
  Items: [
    {
      needsReview: true,
      Title: "Head Coach",
      school: "Florida University",
      lastCheckedTime: "2021-05-08T02:27:10.209Z",
      runID: "7a4d2c61-5d87-4b7a-8f71-64d75b0d46ce",
      prodRecordExists: false,
      coachName: "Urban Meyer",
      id: "Urban Meyer-Florida University"
    },
  ]
}


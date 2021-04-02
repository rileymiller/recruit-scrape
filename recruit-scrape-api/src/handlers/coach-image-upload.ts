import AWS, { DynamoDB } from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'


AWS.config.update({ region: process.env.AWS_REGION })

const getBadRequestResponse = (message: string): APIGatewayProxyResult => ({
  statusCode: 401,
  body: JSON.stringify({
    message: message
  })
})

// Main Lambda entry point
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log(`event: ${JSON.stringify(event)}`)

  try {

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Success!`
      })
    }
  } catch (e) {
    console.log(`There was an error: ${JSON.stringify(e)}`)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error querying DynamoDB: ${JSON.stringify(e)}`
      })
    }
  }
}

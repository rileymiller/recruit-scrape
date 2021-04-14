import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import config from '../../config/config.json'
import { CoachUploadRequestBody } from '../../recruit-scrape-api'
import { base64_encode } from '../utils/convertToBase64'
import { v4 as uuid } from 'uuid'

const runID = uuid()
const walk = (dir, done) => {
  let results = [];

  fs.readdir(dir, (err, list) => {

    if (err) {
      return done(err);
    }

    let pending = list.length;

    if (!pending) {
      return done(null, results);
    }

    list.forEach((file) => {
      file = path.resolve(dir, file);

      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

type CoachMetadata = Omit<CoachUploadRequestBody, 'profilePictureBase64'>

const processCoachConfig = (coachConfigPath: string) => {
  try {
    const teamPathRoot = coachConfigPath.substr(0, coachConfigPath.lastIndexOf('/') + 1)


    const rawCoachData = fs.readFileSync(coachConfigPath).toString()
    const coaches: any[] = JSON.parse(rawCoachData)

    console.log(`teamPathRoot: ${teamPathRoot}`)

    console.log(`coaches: ${JSON.stringify(coaches)}`)

    // need to parse the school and such


    coaches.map(coach => {
      let uploadParams = {
        ...coach,
        school: `Mines`,
        runID
      }

      if (coach.hasOwnProperty('imagePath')) {
        const absoluteImagePath = teamPathRoot + coach.imagePath
        console.log(`absoluteImagePath: ${absoluteImagePath}`)

        const fileName = coach.imagePath.substr(coach.imagePath.lastIndexOf('/'))

        console.log(`fileName: ${fileName}`)

        uploadParams = {
          ...uploadParams,
          fileName
        }
        uploadImage(absoluteImagePath, uploadParams)
      }
    })

  } catch (e) {
    console.error(e)
    // console.error(`Error trying to read ${coachConfigPath}, e: ${JSON.stringify(e)}`)
  }
}


walk(`${process.cwd()}/build`, (err, results) => {
  if (err) {
    throw err
  }

  const coachConfigs = results.filter((file: string) => file.substr(file.lastIndexOf('/')) === '/coaches.json')

  console.log(coachConfigs)

  coachConfigs.map(coachConfigFile => processCoachConfig(coachConfigFile))
})

// TODO: Upload Image to API

const readAPIConfig = () => ({ uploadEndpoint: config.api?.uploadEndpoint })

const uploadImage = async (imagePath, requestParams: CoachMetadata) => {
  console.log(`uploading image with imagePath: ${imagePath} and requestParams: ${JSON.stringify(requestParams)}`)

  const { uploadEndpoint } = readAPIConfig()

  if (!imagePath) {
    throw new Error(`Invalid Image Path`)
  }

  const profileImage = base64_encode(imagePath)

  const params: CoachUploadRequestBody = {
    ...requestParams,
    profilePictureBase64: profileImage
  }

  try {
    const uploadResponse = await axios.post(uploadEndpoint, params)

    if (uploadResponse.data) {
      console.log(uploadResponse.data)
    } else {
      console.log(uploadResponse)
    }
  } catch (e) {
    if (e.response?.statusCode > 399) {
      console.error(`Request error, status code: ${e.response?.statusCode}`)
    }
    if (e.response?.data?.message) {
      console.error(e.response.data.message)
    } else {
      console.error(e)
    }
  }
}
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import config from '../../config/config.json'
import { CoachUploadRequestBody } from '../../recruit-scrape-api'
import { base64_encode } from '../utils/convertToBase64'
import { v4 as uuid } from 'uuid'

const RUN_ID = uuid()

// TODO: may not need this anymore
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

// TODO: there's probably an easier way to do this since we only care about the coaches.json files.
walk(`${process.cwd()}/build`, (err, results) => {
  if (err) {
    throw err
  }

  const coachConfigs = results.filter((file: string) => file.substr(file.lastIndexOf('/')) === '/coaches.json')

  console.log(coachConfigs)

  coachConfigs.map(coachConfigFile => processCoachConfig(coachConfigFile))
})

type CoachMetadata = Omit<CoachUploadRequestBody, 'profilePictureBase64'>

const processCoachConfig = (coachConfigPath: string) => {
  try {
    const teamPathRoot = getTeamFilePath(coachConfigPath)

    const rawCoachData = fs.readFileSync(coachConfigPath).toString()

    const coaches: any[] = JSON.parse(rawCoachData)

    console.log(`teamPathRoot: ${teamPathRoot}`)

    console.log(`coaches: ${JSON.stringify(coaches)}`)

    coaches.map(coach => {

      // TODO: think about what params we want to upload in addition to whatever was scraped
      let uploadParams = {
        ...coach,
        school: `Mines`,
        runID: RUN_ID
      }

      // TODO: expand this as part of the migration from uploadImage => uploadCoach
      if (coach.hasOwnProperty('imagePath')) {
        const absoluteImagePath = teamPathRoot + coach.imagePath
        console.log(`absoluteImagePath: ${absoluteImagePath}`)

        const fileName = coach.imagePath.substr(coach.imagePath.lastIndexOf('/'))

        console.log(`fileName: ${fileName}`)

        uploadParams = {
          ...uploadParams,
          fileName
        }
        uploadCoach(absoluteImagePath, uploadParams)
      }
    })

  } catch (e) {
    console.error(e)
  }
}

const getTeamFilePath = (configPath: string) => configPath.substr(0, configPath.lastIndexOf('/') + 1)

const readAPIConfig = () => ({ uploadEndpoint: config.api?.uploadEndpoint })

/**
 * As part of this function, we will want to upload any of the metadata scraped from the coach bio.
 * This means we'll need to expand the API to not care about which parameters are passed in,
 * but if an image is uploaded with the coach's metadata, we'll upload the image to s3 and store the link as part of 
 * the coaches entry in Dynamo.
 * 
 * Need to do some investigation around how we want to keep track of independent entries. The flow I'm envisioning will have a PROD
 * DDB instance that will require manual approval to add/delete an entry from that database. However, this scrape flow should upload
 * any coaches that failed into the staging DDB table and give some type of signal that an entry has been changed or doesn't exist
 * yet.
 * 
 * @param imagePath 
 * @param requestParams 
 */
const uploadCoach = async (imagePath, requestParams: CoachMetadata) => {
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

    // TODO: DRY up the axios response handling
    if (uploadResponse.data) {
      console.log(uploadResponse.data)
    } else {
      console.log(uploadResponse)
    }
  } catch (e) {
    // TODO: DRY up the axios response handling
    if (e.response?.statusCode > 299) {
      console.error(`Request error, status code: ${e.response?.statusCode}`)
    }
    if (e.response?.data?.message) {
      console.error(e.response.data.message)
    } else {
      console.error(e)
    }
  }
}
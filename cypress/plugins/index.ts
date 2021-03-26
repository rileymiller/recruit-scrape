// cypress/plugins/index.js
import * as fs from 'fs'

const plugins = (on, config) => {
  on('after:screenshot', (details) => {
    console.log(details) // print all details to terminal
    const { name } = details

    const dir = name.substr(0, name.lastIndexOf(`/`))
    const coachName = name.substr(name.lastIndexOf(`/`))
    console.log(`${dir}`)
    console.log(`coachName: ${coachName}`)

    if (!fs.existsSync(`build/${dir}/images`)) {
      console.log(`directory did not exist, creating build/${dir}`)
      fs.mkdirSync(`build/${dir}/images`, { recursive: true });
    }

    const newPath = `build/${dir}/images/${coachName}.png`

    console.log(`newPath: ${newPath}`)
    return new Promise((resolve, reject) => {
      // fs.rename moves the file to the existing directory 'new/path/to'
      // and renames the image to 'screenshot.png'
      fs.rename(details.path, newPath, (err) => {
        if (err) return reject(err)

        // because we renamed and moved the image, resolve with the new path
        // so it is accurate in the test results
        resolve({ path: newPath })
      })
    })
  })
}

export default plugins

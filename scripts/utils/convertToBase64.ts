import * as fs from 'fs'

// function to encode file data to base64 encoded string
export const base64_encode = (file) => {
    console.log(`INFO: running base64_encode: ${file}`)
    // read binary data into base64 stream
    const base64 = fs.readFileSync(file, `base64`);

    return base64
}
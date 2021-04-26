import * as fs from 'fs'

// function to encode file data to base64 encoded string
export const base64EncodeImage = (file_path) => {
  // read binary data into base64 stream
  const base64 = fs.readFileSync(`${__dirname}/${file_path}`, `base64`);

  return base64
}
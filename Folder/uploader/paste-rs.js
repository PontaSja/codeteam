/**
 🍀 paste.rs
 
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://my.codeteam.web.id
 
**/

import axios from "axios"
import fs from "fs"

export async function uploadToPasteRS(path) {
  const file = fs.readFileSync(path)

  const { data } = await axios.post("https://paste.rs", file, {
    headers: {
      "Content-Type": "application/octet-stream"
    }
  })

  return data.trim()
}

uploadToPasteRS("./thumbnail.jpg").then(console.log)

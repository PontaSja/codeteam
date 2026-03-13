/**
 🍀 Scrape Image2Url
 
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://my.codeteam.web.id
 
**/

import fs from "fs"
import path from "path"

const randomVersion = () =>
  `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`

const randomUA = () => `CT Nasa/${randomVersion()}`

const image2url = async (filePath) => {
  const endpoint = "https://www.image2url.com/api/upload"
  const allowed = [".jpg", ".jpeg", ".png", ".gif"]

  if (!fs.existsSync(filePath)) {
    return { success: false, message: "File tidak ditemukan" }
  }

  const ext = path.extname(filePath).toLowerCase()
  if (!allowed.includes(ext)) {
    return { success: false, message: "Format tidak didukung" }
  }

  try {
    const buffer = fs.readFileSync(filePath)
    const fileName = path.basename(filePath)

    let mimeType = "image/jpeg"
    if (ext === ".png") mimeType = "image/png"
    if (ext === ".gif") mimeType = "image/gif"

    const form = new FormData()
    form.append("file", new Blob([buffer], { type: mimeType }), fileName)

    const res = await fetch(endpoint, {
      method: "POST",
      body: form,
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "id-ID,id;q=0.9,en;q=0.8",
        origin: "https://www.image2url.com",
        referer: "https://www.image2url.com/",
        "user-agent": randomUA()
      }
    })

    const text = await res.text()

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: text
      }
    }

    return JSON.parse(text)
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export default image2url


// Usage:
image2url("./image.jpg")
  .then(console.log)

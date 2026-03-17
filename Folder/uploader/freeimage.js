/**
 🍀 Scrape Freeimage.host
 
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://my.codeteam.web.id
 
**/

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

async function getAuthToken() {
  const { data } = await axios.get('https://freeimage.host/')

  const token = data.match(/auth_token\s*=\s*"(.+?)"/)?.[1]

  if (!token) throw 'Auth token gak ketemu'

  return token
}

export async function uploadImage(path) {
  try {
    const token = await getAuthToken()

    const form = new FormData()
    form.append('source', fs.createReadStream(path))
    form.append('type', 'file')
    form.append('action', 'upload')
    form.append('timestamp', Date.now().toString())
    form.append('auth_token', token)

    const { data } = await axios.post('https://freeimage.host/json', form, {
      headers: {
        ...form.getHeaders(),
        'accept': 'application/json'
      }
    })

    return {
      status: data.status_code,
      token,
      url: data.image.url,
      viewer: data.image.url_viewer
    }

  } catch (e) {
    throw e.response?.data || e.message
  }
}

// Usage:
uploadImage("./src/welcome.jpg")
.then(console.log)

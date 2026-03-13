/**
 🍀 Plugins Facebook
 
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://www.codeteam.web.id
 
**/

import axios from "axios"

const quality = "sd"

async function fbVideo(url) {
  const api = "https://serverless-tooly-gateway-6n4h522y.ue.gateway.dev/facebook/video"

  const { data } = await axios.get(api, {
    params: { url },
    headers: {
      accept: "*/*",
      referer: "https://chative.io/",
      "user-agent": "CT Android/2.0"
    }
  })

  if (!data.success) throw "Gagal ambil video"

  return data.videos?.[quality]
}

let handler = async (m, { text, conn }) => {
  if (!text) throw "Masukin link nya"

  let video = await fbVideo(text)

  if (!video) throw "Video tidak ditemukan"

  await conn.sendMessage(m.chat, {
    video: { url: video.url },
    caption: `Size: ${video.size}\nQuality: ${quality}`
  }, { quoted: m })
}

handler.help = ["facebook"]
handler.tags = ["downloader"]
handler.command = /^(fb|facebook)$/i

export default handler

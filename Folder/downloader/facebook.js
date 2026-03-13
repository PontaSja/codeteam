/**
 🍀 Plugins Facebook
 
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://www.codeteam.web.id
 
**/

import axios from "axios"

async function fbVideo(url) {
  const api = "https://serverless-tooly-gateway-6n4h522y.ue.gateway.dev/facebook/video"

  const { data } = await axios.get(api, {
    params: { url },
    headers: {
      accept: "*/*",
      "accept-language": "id-ID",
      referer: "https://chative.io/",
      "user-agent": "CT Android/2.0"
    }
  })

  if (!data.success) throw "Gagal ambil data"

  return {
    title: data.title,
    hd: data.videos?.hd?.url || null,
    hdSize: data.videos?.hd?.size || null,
    sd: data.videos?.sd?.url || null,
    sdSize: data.videos?.sd?.size || null
  }
}

let handler = async (m, { text, conn }) => {
  if (!text) throw "Masukin link Facebook nya"

  let res = await fbVideo(text)

  let url = res.hd || res.sd
  if (!url) throw "Video tidak ditemukan"

  await conn.sendMessage(m.chat, {
    video: { url },
    caption: `📹 *${res.title}*\n\nHD: ${res.hdSize || "-"}\nSD: ${res.sdSize || "-"}`
  }, { quoted: m })
}

handler.help = ["facebook"]
handler.tags = ["downloader"]
/^(fb|facebook)$/i;

export default handler

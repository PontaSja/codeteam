/**
 🍀 Scrape FastDl.cc
 
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://my.codeteam.web.id
 
**/

import axios from "axios"

export async function fastdl(url) {
  try {
    url = url.split("?")[0]

    const headers = {
      accept: "*/*",
      "user-agent": "Mozilla/5.0 (Linux; Android 10)",
      referer: "https://fastdl.cc/"
    }

    let endpoint
    let referer

    if (url.includes("/reel/")) {
      endpoint = "reels/download"
      referer = "https://fastdl.cc/reels"
    } else if (url.includes("/stories/")) {
      endpoint = "story/download"
      referer = "https://fastdl.cc/story"
    } else {
      endpoint = "img/download"
      referer = "https://fastdl.cc/photo"
    }

    headers.referer = referer

    const { data } = await axios.get(
      `https://fastdl.cc/${endpoint}?url=${encodeURIComponent(url)}`,
      { headers }
    )

    if (!data.success) throw new Error("Media tidak ditemukan")

    let media = []

    if (data.images) {
      media = data.images.map(v => v.url)
    } else if (data.url) {
      media = [data.url]
    }

    return {
      status: true,
      type: data.type,
      media
    }

  } catch (e) {
    return {
      status: false,
      message: e.message
    }
  }
}

// Usage:
fastdl("https://www.instagram.com/p/DV24zv3AeGL/?igsh=MXA2aGRkemhvNHNkag==")
.then(console.log)
.catch(console.error)

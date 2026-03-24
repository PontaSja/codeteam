/**
 🍀 Scrape Ytdown.to
 ( download video & audio youtube )
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://my.codeteam.web.id
 
**/

import axios from "axios"
import qs from "qs"

const headers = {
  "accept": "*/*",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  "x-requested-with": "XMLHttpRequest",
  "referer": "https://app.ytdown.to/id21/",
  "origin": "https://app.ytdown.to"
}

function normalizeQ(q = "") {
  q = q.toLowerCase()
  if (q.includes("1080") || q.includes("fhd")) return "1080"
  if (q.includes("720") || q.includes("hd")) return "720"
  if (q.includes("480")) return "480"
  if (q.includes("360") || q.includes("sd")) return "360"
  if (q.includes("240")) return "240"
  if (q.includes("144")) return "144"
  return ""
}

async function convert(url) {
  try {
    const { data } = await axios.post(
      "https://app.ytdown.to/proxy.php",
      qs.stringify({ url }),
      { headers, timeout: 20000 }
    )
    return data?.api?.status === "completed" ? data.api : null
  } catch {
    return null
  }
}

export default async function ytdown(url, quality = "720") {
  try {
    const { data } = await axios.post(
      "https://app.ytdown.to/proxy.php",
      qs.stringify({ url }),
      { headers, timeout: 20000 }
    )

    if (data?.api?.status !== "ok") return { status: false }

    const targetQ = normalizeQ(quality)
    const isAudioOnly = /mp3|audio/i.test(quality)

    let selectedVideo = null
    let fallbackVideo = null
    let bestAudio = null
    let fallbackAudio = null

    for (let item of data.api.mediaItems) {
      const res = await convert(item.mediaUrl)
      if (!res) continue

      const ext = res.fileName?.split(".").pop()?.toLowerCase()

      const obj = {
        quality: item.mediaQuality,
        url: res.fileUrl,
        size: res.fileSize,
        ext,
        mime: item.type === "Video" ? "video/" + ext : "audio/" + ext
      }

      if (item.type === "Video") {
        const qNum = normalizeQ(item.mediaQuality)

        if (qNum == targetQ && !selectedVideo) {
          selectedVideo = obj
        }

        if (!fallbackVideo || Number(qNum) > Number(normalizeQ(fallbackVideo.quality))) {
          fallbackVideo = obj
        }
      }

      if (item.type === "Audio") {
        if (ext === "mp3" && !bestAudio) {
          bestAudio = obj
        }

        if (!fallbackAudio) {
          fallbackAudio = obj
        }
      }
    }

    return {
      status: true,
      title: data.api.title,
      channel: data.api.userInfo?.name,
      thumbnail: data.api.imagePreviewUrl,
      duration: data.api.mediaItems?.[0]?.mediaDuration,
      video: isAudioOnly ? null : (selectedVideo || fallbackVideo),
      audio: bestAudio || fallbackAudio
    }

  } catch (e) {
    return { status: false, error: String(e) }
  }
}

// Usage:
ytdown("https://youtu.be/J4Hqo5unTmo?si=7gThtWRlogN4Tsji", "360p")
.then(console.log)

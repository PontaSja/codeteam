import axios from "axios"
import FormData from "form-data"

async function uploadCloud(buffer, filename = "file.bin", duration = "24h") {
  const form = new FormData()

  form.append("file", buffer, filename)
  form.append("duration", duration)

  const { data } = await axios.post(
    "https://cloud.codeteam.my.id/api/upload",
    form,
    {
      headers: {
        ...form.getHeaders(),
        accept: "*/*"
      },
      maxBodyLength: Infinity
    }
  )

  return data
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""

    if (!mime) {
      return conn.sendMessage(
        m.chat,
        { text: `Kirim atau reply media\n\nContoh:\n${usedPrefix + command}` },
        { quoted: m }
      )
    }

    await conn.sendMessage(
      m.chat,
      { text: "Uploading media..." },
      { quoted: m }
    )

    const buffer = await q.download()
    const ext = mime.split("/")[1] || "bin"

    const res = await uploadCloud(buffer, `upload.${ext}`)

    const url = "https://cloud.codeteam.my.id" + res.files[0].url

    await conn.sendMessage(
      m.chat,
      {
        text: `✅ Upload berhasil

Type: ${mime}
URL:
${url}`
      },
      { quoted: m }
    )

  } catch (e) {
    await conn.sendMessage(
      m.chat,
      { text: `Error: ${e.message}` },
      { quoted: m }
    )
  }
}

handler.help = ["codeteam"]
handler.tags = ["tools"]
handler.command = ["codeteam"]

export default handler

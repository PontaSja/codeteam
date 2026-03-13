import axios from "axios"
import FormData from "form-data"

const pontaUrl = async (buffer, mime = "application/octet-stream") => {
  const ext = mime.split("/")[1] || "bin"

  const form = new FormData()
  form.append("file", buffer, {
    filename: `upload.${ext}`,
    contentType: mime
  })

  form.append("expire_value", "7")
  form.append("expire_unit", "hours")

  const { data } = await axios.post(
    "https://lunara.softbotz.my.id/upload",
    form,
    {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    }
  )

  if (!data.file_url) throw new Error("Upload gagal")

  return data.file_url
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
    const url = await pontaUrl(buffer, mime)

    await conn.sendMessage(
      m.chat,
      {
        text: `✅ Upload berhasil\n\nType: ${mime}\nURL:\n${url}`
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

handler.help = ["lunara"]
handler.tags = ["tools"]
handler.command = ["lunara"]

export default handler

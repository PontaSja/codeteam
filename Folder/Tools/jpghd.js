export async function jpghdScrape(imageUrl) {
  const fakeIP = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256)
  ).join('.')

  const baseHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'Origin': 'https://jpghd.com',
    'Referer': 'https://jpghd.com/id',
    'Cookie': 'jpghd_lng=id',
    'User-Agent': 'CT Android/1.1.0',
    'X-Forwarded-For': fakeIP,
    'X-Real-IP': fakeIP
  }

  const create = await fetch('https://jpghd.com/api/task/', {
    method: 'POST',
    headers: baseHeaders,
    body: `conf=${JSON.stringify({
      filename: imageUrl.split('/').pop(),
      livephoto: "",
      color: "",
      scratch: "",
      style: "art",
      input: imageUrl
    })}`
  })

  const createJson = await create.json()
  if (createJson.status !== 'ok') {
    return { status: false, message: 'Gagal create task', fakeIP }
  }

  const tid = createJson.tid

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2000))

    const check = await fetch(`https://jpghd.com/api/task/${tid}`, {
      headers: {
        'Accept': 'application/json',
        'Referer': 'https://jpghd.com/id',
        'Cookie': 'jpghd_lng=id',
        'User-Agent': 'CT Android/1.1.0',
        'X-Forwarded-For': fakeIP,
        'X-Real-IP': fakeIP
      }
    })

    const checkJson = await check.json()
    const data = checkJson[tid]

    if (data?.status === 'success') {
      return {
        status: true,
        tid,
        result: data.output.jpghd,
        size: data.output.size
      }
    }
  }

  return { status: false, message: 'Timeout, task belum selesai', fakeIP }
}

const res = await jpghdScrape('https://www.codeteam.zone.id/files/QNoPsNYDD.jpg')
console.log(res)

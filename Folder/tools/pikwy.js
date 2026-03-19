/**
 🍀 Scrape Pikwy.com
( Website Screenshot From Url )
 
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://my.codeteam.web.id
 
**/

import axios from "axios"

async function pikwy(url) {
  let target = encodeURIComponent(url)

  let { data } = await axios.get(`https://api.pikwy.com/?tkn=125&d=3000&u=${target}&fs=1&w=1280&h=1200&s=100&z=100&f=jpg&rt=jweb`, {
    headers: {
      accept: "*/*",
      "accept-language": "id-ID",
      referer: "https://pikwy.com/"
    }
  })

  return {
    date: data.date,
    page: data.ourl,
    image: data.iurl
  }
}

export default pikwy

// Usage:
pikwy("https://www.google.com")
.then(res => console.log(res))

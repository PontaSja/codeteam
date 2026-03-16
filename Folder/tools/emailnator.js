/**
 🍀 Scrape Email Temporary 
 
 * CR Ponta Sensei
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://my.codeteam.web.id
 
**/

import axios from "axios";

const client = axios.create({
  baseURL: "https://www.emailnator.com",
  withCredentials: true,
  headers: {
    "user-agent": "Mozilla/5.0",
    "accept": "application/json, text/plain, */*"
  }
});

async function getSession() {
  const home = await client.get("/");
  const cookies = home.headers["set-cookie"].join("; ");
  const xsrf = decodeURIComponent(cookies.match(/XSRF-TOKEN=([^;]+)/)[1]);
  return { cookies, xsrf };
}

function auth(session) {
  return {
    headers: {
      cookie: session.cookies,
      "x-xsrf-token": session.xsrf,
      "x-requested-with": "XMLHttpRequest",
      "content-type": "application/json"
    }
  };
}

async function generateEmail() {
  const session = await getSession();
  const res = await client.post(
    "/generate-email",
    { email: ["plusGmail", "dotGmail", "googleMail"] },
    auth(session)
  );
  return res.data;
}

async function getInboxAndOpen(email) {
  const session = await getSession();
  const inboxRes = await client.post(
    "/message-list",
    { email },
    auth(session)
  );
  const inbox = inboxRes.data.messageData || [];
  const mail = inbox.find(m => m.messageID !== "ADSVPN");
  if (!mail) return null;

  const htmlRes = await client.post(
    "/message-list",
    { email, messageID: mail.messageID },
    auth(session)
  );

  return {
    messageID: mail.messageID,
    from: mail.from,
    subject: mail.subject,
    time: mail.time,
    html: htmlRes.data
  };
}

// example generate email nya
(async () => {
  const email = await generateEmail();
  console.log(email);
})();

/*
// example cek inbox
(async () => {
  const mail = await getInboxAndOpen("pan.t.herd.asp.e.n@gmail.com");
  console.log(mail);
})(); */

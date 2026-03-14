/**
 🍀 Scrape Short-URL
 
 * CR Ponta CT
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://my.codeteam.web.id
 
**/

import axios from 'axios';
import { URL } from 'url';

const createKeyword = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const extractShortUrl = (html) => {
  const shortUrlMatch = html.match(/value="https:\/\/short-url\.org\/[^"]+/i);
  
  if (!shortUrlMatch) {
    return null;
  }
  
  return shortUrlMatch[0].replace('value="', '');
};

const createHeaders = () => ({
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': 'application/x-www-form-urlencoded',
  'origin': 'https://short-link.me',
  'referer': 'https://short-link.me/id/',
  'user-agent': 'CT Android/2.0',
});

const createRequestBody = (url, keyword) => {
  const body = new URLSearchParams();
  body.append('url', url);
  body.append('keyword', keyword);
  return body;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const shortLinkMe = async (url, maxRetries = 3) => {
  if (!isValidUrl(url)) {
    return {
      success: false,
      error: 'URL tidak valid'
    };
  }

  const randomKeyword = createKeyword();
  const headers = createHeaders();
  const body = createRequestBody(url, randomKeyword);

  let retries = 0;
  let lastError;

  while (retries < maxRetries) {
    try {
      const response = await axios.post('https://short-link.me/id/', body, { headers });
      const shortUrl = extractShortUrl(response.data);

      if (!shortUrl) {
        throw new Error('Gagal menemukan short URL di respons');
      }

      return {
        success: true,
        shortUrl,
        keyword: randomKeyword
      };

    } catch (error) {
      lastError = error;
      retries++;
      
      if (retries >= maxRetries) {
        break;
      }
      
      await delay(1000 * retries);
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Gagal setelah beberapa percobaan',
    attempts: retries
  };
};

// Usage:
shortLinkMe("https://www.google.com")
  .then(console.log);

export { shortLinkMe, createKeyword, isValidUrl };

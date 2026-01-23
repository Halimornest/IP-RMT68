const axios = require('axios')

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/search'
console.log('YT KEY:', process.env.YOUTUBE_API_KEY)

async function searchVideos({ query, maxResults = 3 }) {
  const res = await axios.get(YOUTUBE_API, {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults,
    },
  })

  return res.data.items.map(item => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    channel: item.snippet.channelTitle,
  }))
}

module.exports = { searchVideos }

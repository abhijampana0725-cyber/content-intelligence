const express = require('express');
const axios = require('axios');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/auth/callback';

// Step 1: Redirect to TikTok OAuth
app.get('/auth/tiktok', (req, res) => {
  const params = new URLSearchParams({
    client_key: CLIENT_KEY,
    scope: 'user.info.basic,user.info.profile,user.info.stats,video.list',
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: Math.random().toString(36).substring(2),
  });
  res.redirect(`https://www.tiktok.com/v2/auth/authorize/?${params}`);
});

// Step 2: Handle OAuth callback — exchange code for token
app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.redirect(`http://localhost:5173?error=auth_denied`);
  try {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      new URLSearchParams({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const { access_token } = response.data;
    res.redirect(`http://localhost:5173?access_token=${access_token}`);
  } catch (err) {
    console.error('Token exchange error:', err.response?.data || err.message);
    res.redirect(`http://localhost:5173?error=token_failed`);
  }
});

// Get user profile
app.get('/api/user', async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const response = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      params: {
        fields: 'open_id,avatar_url,display_name,bio_description,follower_count,following_count,likes_count,video_count',
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data.data.user);
  } catch (err) {
    console.error('User fetch error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get videos
app.post('/api/videos', async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/video/list/',
      { max_count: 20 },
      {
        params: {
          fields: 'id,title,video_description,duration,cover_image_url,share_url,view_count,like_count,comment_count,share_count,create_time',
        },
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }
    );
    res.json(response.data.data.videos || []);
  } catch (err) {
    console.error('Videos fetch error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// AI Strategist
app.post('/api/strategist', async (req, res) => {
  const { videos, topic } = req.body;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const topVideos = [...videos]
    .map(v => ({
      ...v,
      er: v.view_count > 0 ? ((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100 : 0,
    }))
    .sort((a, b) => b.er - a.er)
    .slice(0, 5);

  const videoSummary = topVideos
    .map(
      v =>
        `Caption: "${v.video_description}" | Views: ${v.view_count} | Likes: ${v.like_count} | Comments: ${v.comment_count} | Shares: ${v.share_count} | Posted: ${new Date(v.create_time * 1000).toLocaleDateString()}`
    )
    .join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert TikTok content strategist. Analyze the provided video data and return actionable recommendations as valid JSON only — no markdown, no explanation, just the JSON object.',
        },
        {
          role: 'user',
          content: `My top performing TikTok videos:\n${videoSummary}\n\nTopic I want to post about: "${topic || 'come up with the best idea based on my content'}"\n\nReturn this exact JSON structure:\n{\n  "hookAnalysis": { "bestStyle": "string", "avgER": "string like 6.9%", "insight": "one sentence" },\n  "bestPostTime": { "day": "string like Sunday", "window": "string like 5am-11am", "label": "Morning" },\n  "topHashtags": ["tag1", "tag2", "tag3"],\n  "retireHashtags": ["tag1", "tag2"],\n  "winningFormula": { "hook": "string", "time": "string", "hashtags": ["tag1","tag2"], "topic": "string" },\n  "variations": [\n    { "type": "Question", "opener": "string", "body": "string (2-3 sentences)", "cta": "string" },\n    { "type": "POV/Story", "opener": "string", "body": "string (2-3 sentences)", "cta": "string" },\n    { "type": "Statement", "opener": "string", "body": "string (2-3 sentences)", "cta": "string" }\n  ],\n  "whatToFilm": "string — 2-3 sentence director note describing exactly what to film",\n  "suggestedHashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]\n}`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    const result = JSON.parse(raw);
    res.json(result);
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

app.listen(3001, () => console.log('✅ Backend running at http://localhost:3001'));

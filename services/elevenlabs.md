# ElevenLabs Service Reference

## Lane: 🟡 YELLOW (via n8n)
## Platform: n8n

## n8n Workflow Pattern

### Nodes Required
1. HTTP Request (POST to ElevenLabs)
2. Move Binary Data
3. Google Drive (upload) or Write Binary File

### HTTP Request Configuration
```
Method: POST
URL: https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
Headers:
  xi-api-key: {{$credentials.elevenlabs_api_key}}
  Content-Type: application/json
Body:
{
  "text": "Text to convert",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75
  }
}
```

### Voice IDs (Examples)
- Rachel: 21m00Tcm4TlvDq8ikWAM
- Adam: pNInz6obpgDQGcFmaJgB
- Bella: EXAVITQu4vr4xnSDxMaL

### Output
- Binary audio (MP3)
- Save to Google Drive or return URL

## Alternative: Warp Direct
```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}" \
  -H "xi-api-key: $ELEVENLABS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}' \
  --output speech.mp3
```
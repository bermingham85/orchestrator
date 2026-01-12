# FAL AI Service Reference

## Lane: 🟢 GREEN (Direct API)
## Platform: Warp

## Authentication
```bash
FAL_KEY=$(grep FAL .env.shared | cut -d= -f2)
```

## Endpoints

### Image Generation
```bash
curl -X POST "https://fal.run/fal-ai/flux/dev" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "your prompt here",
    "image_size": "landscape_16_9",
    "num_images": 1
  }'
```

### Available Models
| Model | Endpoint | Best For |
|-------|----------|----------|
| Flux Dev | fal-ai/flux/dev | General images |
| Flux Pro | fal-ai/flux-pro | High quality |
| SDXL | fal-ai/stable-diffusion-xl | Fast generation |
| SadTalker | fal-ai/sadtalker | Talking avatar |

### Image Sizes
- square_hd: 1024x1024
- square: 512x512
- portrait_4_3: 768x1024
- portrait_16_9: 576x1024
- landscape_4_3: 1024x768
- landscape_16_9: 1024x576

## Response
```json
{
  "images": [
    {"url": "https://...", "content_type": "image/jpeg"}
  ]
}
```

## Notes
- Poll for async requests
- Results available ~60 seconds
- Use instead of Midjourney when possible
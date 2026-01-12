# Hedra Service Reference

## Lane: 🔴 RED (Browser Required)
## Platform: Warp (Playwright)

## ⚠️ PREFER GREEN ALTERNATIVE
Use FAL AI SadTalker for similar results.

## Browser Automation Steps

```javascript
// 1. Navigate to Hedra
await page.goto('https://www.hedra.com/');

// 2. Login (session required)
// Handle auth separately

// 3. Start new project
await page.click('button:has-text("Create")');

// 4. Upload audio
await page.setInputFiles('input[type="file"]', audioPath);

// 5. Select/upload avatar
await page.click('.avatar-selector');
// or upload custom

// 6. Generate
await page.click('button:has-text("Generate")');

// 7. Wait (2-5 minutes)
await page.waitForSelector('.download-button', {timeout: 300000});

// 8. Download
await page.click('.download-button');
```

## Reliability: ★★☆☆☆
- Long generation times
- UI changes frequently
- Session management required

## GREEN Alternative: FAL SadTalker
```bash
curl -X POST "https://fal.run/fal-ai/sadtalker" \
  -H "Authorization: Key $FAL_KEY" \
  -d '{
    "source_image_url": "https://...",
    "driven_audio_url": "https://..."
  }'
```
- API-native
- More reliable
- Faster results
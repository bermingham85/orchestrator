# Midjourney Service Reference

## Lane: 🔴 RED (Browser Required)
## Platform: Warp (Playwright) or ChatGPT

## ⚠️ PREFER GREEN ALTERNATIVE
Use FAL AI Flux for similar results without browser automation.

## Browser Automation Steps (Warp/Playwright)

```javascript
// 1. Navigate to Discord
await page.goto('https://discord.com/channels/@me');

// 2. Login if needed
// (handle auth separately)

// 3. Go to Midjourney server/channel
await page.goto('https://discord.com/channels/{server_id}/{channel_id}');

// 4. Type /imagine command
await page.click('[data-slate-editor="true"]');
await page.type('/imagine ');
await page.keyboard.press('Tab');
await page.type(prompt);
await page.keyboard.press('Enter');

// 5. Wait for generation (60-90 seconds)
await page.waitForTimeout(90000);

// 6. Click upscale button (U1-U4)
await page.click('button:has-text("U1")');

// 7. Wait and download
await page.waitForTimeout(30000);
// Right-click image, save
```

## Reliability Issues
- Discord UI changes break automation
- Rate limits apply
- Session management complex
- 60-180 second generation time

## Recommendation
**Use FAL Flux instead:**
```bash
curl -X POST "https://fal.run/fal-ai/flux/dev" \
  -H "Authorization: Key $FAL_KEY" \
  -d '{"prompt": "..."}'
```
- Faster (10-30 sec)
- More reliable
- API-native
- Similar quality
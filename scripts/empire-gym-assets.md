# Empire Gym — assets

All five Empire Gym assets live in the shared production project's public
`business-assets` storage bucket, under the business id prefix. Every URL on
the `businesses` row and the `business_media` rows points at these exact
paths; there are no off-site CDN references left.

- Project: `nrntaowmmemhjfxjqjch`
- Bucket: `business-assets` (public)
- Empire business id: `2ec3b899-e539-4a07-93f3-16682ad2ef86`
- Folder: `business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/`

## Files in the bucket

| File | Used by |
| --- | --- |
| `logo.png` | `businesses.logo_url`, `businesses.processed_icon_url`, `business_media` kind `logo` |
| `hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png` (hero still) | `businesses.hero_image_url`, `businesses.cover_image_url`, `businesses.website_hero_image_url`, `businesses.gallery_urls[2]`, `business_media` kind `hero` (url) and `gallery` (sort_order 2) |
| `hf_20260616_161710_a24bf8a8-eaee-4b49-bb5f-124790b812f9.mp4` (hero video) | `business_media` kind `hero` (video_url) |
| `coaches.png` (about portrait + gallery) | `businesses.founder_photo_url`, `businesses.gallery_urls[1]`, `business_media` kind `about` and `gallery` (sort_order 1) |
| `interior.png` (gym floor) | `businesses.gallery_urls[0]`, `business_media` kind `gallery` (sort_order 0) |

## Public URL pattern

```
https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/<file>
```

# Empire Gym — asset upload list

The Empire Gym row references the assets below. The hero photo + video are
already public on the design pack's CloudFront origin and resolve today. The
remaining three images (logo, coaches, interior) need to be uploaded to the
shared production Supabase project's `business-assets` storage bucket under
the business id prefix.

- Project: `nrntaowmmemhjfxjqjch`
- Bucket: `business-assets` (public)
- Empire business id: `2ec3b899-e539-4a07-93f3-16682ad2ef86`

## Upload these three files

| Source (design pack) | Destination (storage path) | Public URL once uploaded |
| --- | --- | --- |
| `media/logo.png` (Empire emblem) | `business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/logo.png` | `https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/logo.png` |
| `media/coaches.png` (competitor + coach) | `business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/coaches.png` | `https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/coaches.png` |
| `media/interior.png` (gym floor) | `business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/interior.png` | `https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/interior.png` |

These exact public URLs are already written into the `businesses` row
(`logo_url`, `processed_icon_url`, `founder_photo_url`, `gallery_urls[0..1]`)
and into the `business_media` rows (`logo`, `about`, two `gallery` rows), so
the live site is byte-for-byte ready as soon as the three files are uploaded
to those paths.

## Already public (no upload required)

| Asset | URL |
| --- | --- |
| Hero photo (EMPIRE emblem still) | `https://d8j0ntlcm91z4.cloudfront.net/user_3Ei7AlrjOP38XotvP8uZ27B9ge5/hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png` |
| Hero video (autoplay loop) | `https://d8j0ntlcm91z4.cloudfront.net/user_3Ei7AlrjOP38XotvP8uZ27B9ge5/hf_20260616_161710_a24bf8a8-eaee-4b49-bb5f-124790b812f9.mp4` |

These are the `HERO_IMG` / `HERO_VID` constants from the design pack's
`data.jsx` and are referenced from `website_hero_image_url`, `hero_image_url`,
`cover_image_url`, `gallery_urls[2]`, and the `hero` row in `business_media`.

# LinkedIn assets

Rendered from `site/app/api/og/brand/route.tsx`, so they use the same fonts
and tokens as the site and cannot drift from it. To re-export after a copy
change, refetch:

    /api/og/brand?kind=logo     400 x 400    company logo
    /api/og/brand?kind=cover    1128 x 191   company page cover
    /api/og/brand?kind=banner   1584 x 396   personal profile banner
    /api/og/brand?kind=avatar   1080 x 1080  square avatar, any platform

## Where each one goes

| File | Upload to |
|---|---|
| `notavc-logo.png` | Company page → Edit page → Page logo |
| `notavc-cover.png` | Company page → Edit page → Cover image |
| `notavc-banner.png` | Personal profile → background/banner image |
| `notavc-avatar.png` | Instagram, X, anywhere square |

## Why the layout is right-aligned

LinkedIn overlays the profile photo (personal) or the page logo (company)
across the bottom-left of the cover image. Anything placed there is covered.
The lockup sits right so it survives that overlap and every responsive crop.

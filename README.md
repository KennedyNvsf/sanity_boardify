# Fullstack Boardify: Next.js 14, Server Actions, React, SanityCMS, Stripe, Tailwind, Typescript
![image](https://github.com/AntonioErdeljac/next13-trello/assets/23248726/fd260249-82fa-4588-a67a-69bb4eb09067)


This is a repository for Boardify: Next.js 14, Server Actions, React, SanityCMS, Stripe, Tailwind, Typescript


Key Features:
- Clerk Authentication 
- Organizations / Workspaces
- Board creation
- Unsplash API for random beautiful cover images
- Activity log for entire organization
- Board rename and delete
- List creation
- List rename, delete, drag & drop reorder and copy
- Card creation
- Card description, rename, delete, drag & drop reorder and copy
- Card activity log
- Board limit for every organization
- Stripe subscription for each organization to unlock unlimited boards
- Landing page
- Sanity CMS
- shadcnUI & TailwindCSS


### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_TOKEN=


NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=


NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET= 

```

### Running app

```shell
npm run dev
```
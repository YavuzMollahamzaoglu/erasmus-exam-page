# Frontend (Create React App)

This app is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## GA4 activation (optional)

Google Analytics 4 is supported out of the box. The router initializes GA and sends pageviews on SPA route changes when a measurement ID is present.

1) On Vercel, open Project Settings → Environment Variables and add:

- Key: `REACT_APP_GA_MEASUREMENT_ID`
- Value: your GA4 measurement ID (e.g. `G-XXXXXXXXXX`)
- Target: Production (and Preview if you want)

2) Redeploy. GA will load automatically on the client and pageviews will be tracked.

Local development: copy `.env.example` to `.env.local` and fill in `REACT_APP_GA_MEASUREMENT_ID` to test.

Notes:
- GA is free at the standard tier in GA4.
- The site also uses Vercel Analytics; GA complements it for marketing/reporting.

## Image optimization quick guide

- Prefer modern formats (AVIF/WebP) alongside PNG/JPG. Name them with the same basename (e.g. `hero.png`, `hero.webp`, `hero.avif`).
- Use the `ResponsiveImage` component (`src/components/ResponsiveImage.tsx`) to automatically try AVIF/WebP and fall back to the original.
- Always set explicit `width` and `height` to reduce layout shift.
- Use SVG for logos/icons when possible.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

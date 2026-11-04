import { defineCliConfig } from 'sanity/cli';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'sxvw8jh8';
export default defineCliConfig({
  api: { projectId, dataset: process.env.SANITY_STUDIO_DATASET || 'production' },
  studioHost: process.env.SANITY_STUDIO_HOST || 'izaugtmilestiba-sxvw8jh8',
  deployment: {
    appId: process.env.SANITY_STUDIO_APP_ID || (projectId === 'sxvw8jh8' ? 'punq65zaxf5m75pmnjwkwbr2' : undefined),
    autoUpdates: false,
  },
});

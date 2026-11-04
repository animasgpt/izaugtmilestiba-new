import { defineCliConfig } from 'sanity/cli';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'vl2g5s69';
export default defineCliConfig({
  api: { projectId, dataset: process.env.SANITY_STUDIO_DATASET || 'production' },
  studioHost: process.env.SANITY_STUDIO_HOST || 'izaugtmilestiba-redaktors',
  deployment: {
    appId: process.env.SANITY_STUDIO_APP_ID || (projectId === 'vl2g5s69' ? 'ckc7f4qf8e7df66yafkvpep9' : undefined),
    autoUpdates: false,
  },
});

import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "vl2g5s69",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2026-09-10",
  useCdn: false,
  perspective: 'published',
});

const builder = createImageUrlBuilder(sanityClient);
type SanityImageSource = Parameters<ReturnType<typeof createImageUrlBuilder>["image"]>[0];

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

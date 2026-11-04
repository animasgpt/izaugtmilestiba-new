import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "vl2g5s69",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2026-09-10",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

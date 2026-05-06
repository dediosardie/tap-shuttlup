import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tap-shuttlup.vercel.app/";
  return [
    "",
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/cards",
    "/dashboard/analytics",
    "/dashboard/themes",
    "/dashboard/settings",
    "/dashboard/modes",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}

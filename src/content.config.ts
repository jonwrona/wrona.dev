import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import slugify from "slugify";
import { NOCODB_KEY, NOCODB_URL } from "astro:env/server";

// 4. Define your collection(s)
const projects = defineCollection({
  loader: async () => {
    const response = await fetch(
      `${NOCODB_URL}/p8nc2s521axihp1/mel5cxe1yq1ly7g/records?where=(Publish,eq,true)`,
      {
        method: "GET",
        headers: {
          "xc-token": NOCODB_KEY,
        },
      },
    );
    const data = await response.json();
    return (
      data.records?.map(
        ({
          id,
          fields,
        }: {
          id: string | number;
          fields: Record<string, any>;
        }) => ({
          id: slugify(fields["Title"] || id, { strict: true, lower: true }),
          title: fields["Title"],
          markdown: fields["Page Content"],
        }),
      ) || []
    );
  },
  schema: z.object({
    id: z.string(),
    title: z.string(),
    markdown: z.nullable(z.string()),
  }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { projects };

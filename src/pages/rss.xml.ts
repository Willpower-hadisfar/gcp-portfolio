import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('writing', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  return rss({
    title: 'William Power | Writing',
    description: 'Long-form notes on architecture, AI governance, and shipped project work.',
    site: context.site ?? 'https://axiomatic-spark-505611-t0.web.app',
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/writing/${post.id}/`,
        categories: post.data.tags,
      })),
  });
}

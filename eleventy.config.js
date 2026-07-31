/**
 * Eleventy config — Narrow Digital Marketing
 *
 * What this does:
 *   - reads everything in /src
 *   - copies /src/assets straight through to /_site/assets untouched
 *   - writes finished, plain HTML into /_site
 *
 * /_site is the folder you deploy. Nothing in it needs Node to run.
 * You should not need to edit this file for normal content changes.
 */

export default function (eleventyConfig) {
  // ---- Static assets: copied as-is, no processing ------------------------
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/_headers': '_headers' });

  // Rebuild the browser when CSS/JS change during `npm start`
  eleventyConfig.addWatchTarget('src/assets/css/');
  eleventyConfig.addWatchTarget('src/assets/js/');

  // ---- Filters -----------------------------------------------------------

  // 2026-07-28 — used in sitemap.xml
  eleventyConfig.addFilter('isoDate', (value) =>
    new Date(value || Date.now()).toISOString().slice(0, 10)
  );

  // Current year — used in the footer copyright
  eleventyConfig.addShortcode('year', () => String(new Date().getFullYear()));

  // ---- Collections -------------------------------------------------------

  // Every case study in /src/work/, newest first.
  // Add a new .njk file in that folder and it shows up on /work/ automatically.
  eleventyConfig.addCollection('work', (api) =>
    api.getFilteredByTag('work').sort((a, b) => (b.data.order || 0) - (a.data.order || 0))
  );

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html']
  };
}

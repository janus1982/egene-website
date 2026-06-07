/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://egene.dk",
  generateRobotsTxt: false, // vi har vores egen public/robots.txt
  changefreq: "weekly",
  priority: 0.8,
  // Forsiden får højeste prioritet, undersider 0.8
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "weekly",
      priority: path === "/" ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    };
  },
  // Studio og API skal ikke i sitemap
  exclude: ["/studio", "/studio/*"],
};

const path = require("path");
const siteMetadata = {
  title: "Gatsby Theme Primer Wiki",
  shortName: "Wiki",
  description: "A Gatsby theme for creating Primer wiki sites",
  siteUrl: "https://demo-wiki.owenyoung.com",
};
// const contentFolder = "content6";
const contentFolder = "foam-content";

module.exports = {
  siteMetadata,
  // pathPrefix: "/wiki",
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: path.resolve(`./${contentFolder}`),
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        policy: [{ userAgent: "*", disallow: "/" }],
      },
    },
    {
      resolve: "gatsby-theme-primer-wiki",
      options: {
        sidebarDepth: 0,
        // sidebarDefault: "tag",
        // shouldSupportTags: true,
        defaultColorMode: "night",
        nav: [
          {
            title: "Github",
            url: "https://github.com/theowenyoung/gatsby-theme-primer-wiki",
          },
        ],
        editUrl: `https://github.com/theowenyoung/gatsby-theme-primer-wiki/tree/main/example/${contentFolder}/`,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: path.resolve("./static/logo.png"),
      },
    },
  ],
};

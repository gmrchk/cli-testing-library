module.exports = {
    siteMetadata: {
        siteUrl: `https://LibNamegmrchk.com`,
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-styled-components',
        'gatsby-plugin-offline',
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `LibName.gmrchk.com`,
                short_name: `LibTitle`,
                start_url: `/`,
                background_color: `#040404`,
                theme_color: `#040404`,
                display: `standalone`,
                icon: `src/images/icon.png`,
            },
        },
    ],
};

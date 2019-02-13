const path = require('path');

module.exports = {
    siteMetadata: {
        title: 'Rusty Tirr',
        description: '티르의 아무글 대잔치.',
        author: 'Wonwoo Choi',
        twitter: '@pubTirr',
    },
    plugins: [
        'gatsby-plugin-typescript',
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            maxWidth: 750,
                        },
                    },
                    'gatsby-remark-autolink-headers',
                    {
                        resolve: 'gatsby-remark-prismjs',
                        options: {
                            noInlineHighlight: true,
                        },
                    },
                ],
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'pages',
                path: path.join(__dirname, 'src/pages'),
            },
        },
        'gatsby-plugin-react-helmet',
    ],
};

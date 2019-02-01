const path = require('path');

module.exports = {
    siteMetadata: {
        title: 'Rusty Tirr',
        description: '티르의 아무글 대잔치.',
        author: 'Wonwoo Choi',
    },
    plugins: [
        'gatsby-plugin-typescript',
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        'gatsby-transformer-remark',
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

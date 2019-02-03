import * as path from 'path';

import { CreateNodeArgs, CreatePagesArgs, GatsbyNode } from 'gatsby';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}-/;
export const onCreateNode = ({
    node,
    getNode,
    actions,
}: CreateNodeArgs): void => {
    if (node.internal.type === 'MarkdownRemark') {
        // markdown
        const fileNode = getNode(node.parent); // (pages/)<yyyy-mm-dd>-<title>/index.md
        const dirname = path.dirname(fileNode.relativePath);
        const match = DATE_REGEX.exec(dirname);
        if (match == null) {
            return;
        }
        const date = match[0].substr(0, match[0].length - 1);
        actions.createNodeField({
            node,
            name: 'date',
            value: date,
        });
        actions.createNodeField({
            node,
            name: 'slug',
            value: `/${dirname}/`,
        });
    }
};

export const createPages: GatsbyNode['createPages'] = async ({
    graphql,
    getNode,
    actions,
}: CreatePagesArgs) => {
    const data = await graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                        headings {
                            depth
                            value
                        }
                    }
                }
            }
        }
    `);
    for (const { node } of data.data.allMarkdownRemark.edges) {
        actions.createPage({
            path: node.fields.slug,
            component: path.resolve(__dirname, '../src/templates/post.tsx'),
            context: {
                slug: node.fields.slug,
            },
        });
    }

    const postCount = data.data.allMarkdownRemark.edges.length;
    const postsPerPage = 5;
    const totalPages = Math.ceil(postCount / postsPerPage);
    actions.createPage({
        path: '/',
        component: path.resolve(__dirname, '../src/templates/list.tsx'),
        context: {
            limit: postsPerPage,
            skip: 0,
            currentPage: 1,
            totalPages,
        },
    });
    for (const zeroBasedPage of new Array(totalPages).keys()) {
        const currentPage = zeroBasedPage + 1;
        actions.createPage({
            path: `/posts/${currentPage}/`,
            component: path.resolve(__dirname, '../src/templates/list.tsx'),
            context: {
                limit: postsPerPage,
                skip: zeroBasedPage * postsPerPage,
                currentPage,
                totalPages,
            },
        });
    }
};

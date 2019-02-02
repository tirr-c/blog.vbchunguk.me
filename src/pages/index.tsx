import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/Layout';
import PostListItem from '../components/PostListItem';
import SEO from '../components/SEO';

interface Props {
    data: {
        allMarkdownRemark: {
            edges: {
                node: {
                    excerpt: string;
                    frontmatter: {
                        title: string;
                    };
                    fields: {
                        slug: string;
                    };
                };
            }[];
        };
    };
}

const Index: React.FunctionComponent<Props> = ({ data }) => {
    const posts = data.allMarkdownRemark.edges.map(({ node }) => {
        return (
            <PostListItem
                key={node.fields.slug}
                slug={node.fields.slug}
                title={node.frontmatter.title}
                excerpt={node.excerpt}
            />
        );
    });
    return (
        <>
            <SEO title="Posts" />
            <Layout>{posts}</Layout>
        </>
    );
};

export default Index;

export const query = graphql`
    {
        allMarkdownRemark(
            limit: 5
            sort: { fields: fields___date, order: DESC }
        ) {
            edges {
                node {
                    excerpt
                    frontmatter {
                        title
                    }
                    fields {
                        slug
                    }
                }
            }
        }
    }
`;

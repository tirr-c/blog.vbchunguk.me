import React from 'react';
import { Link } from 'gatsby';

import * as styles from './PostListItem.module.css';

interface Props {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
}

const PostListItem: React.FunctionComponent<Props> = ({
    slug,
    title,
    date,
    excerpt,
}) => {
    return (
        <div className={styles.item}>
            <div className={styles.title}>
                <Link to={slug}>{title}</Link>
                <span className={styles.date}>{date}</span>
            </div>
            <div className={styles.excerpt}>{excerpt}</div>
        </div>
    );
};

export default PostListItem;

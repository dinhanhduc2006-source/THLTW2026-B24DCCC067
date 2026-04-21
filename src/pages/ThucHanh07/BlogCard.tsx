import React from 'react';
import { Card, Tag } from 'antd';
import { Post } from './models';

const { Meta } = Card;

interface BlogCardProps {
	post: Post;
	onClick: (postId: number) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
	return (
		<Card
			hoverable
			cover={<img alt={post.title} src={post.coverImage} style={{ height: 200, objectFit: 'cover' }} />}
			onClick={() => onClick(post.id)}
			style={{ marginBottom: 16, cursor: 'pointer' }}
		>
			<Meta
				title={post.title}
				description={
					<>
						<p style={{ marginBottom: 8 }}>{post.excerpt}</p>
						<div style={{ fontSize: '12px', color: '#666' }}>
							<p>
								<strong>Tác giả:</strong> {post.author}
							</p>
							<p>
								<strong>Ngày:</strong> {post.publishedAt}
							</p>
						</div>
						<div style={{ marginTop: 8 }}>
							{post.tags.map((tag) => (
								<Tag key={tag} color='blue' style={{ marginRight: 4, marginBottom: 4 }}>
									{tag}
								</Tag>
							))}
						</div>
					</>
				}
			/>
		</Card>
	);
};

export default BlogCard;

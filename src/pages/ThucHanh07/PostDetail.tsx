import React, { useState, useEffect } from 'react';
import { Button, Tag, Row, Col, Space, Avatar, Card } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { getPostById, getPostsByTag, updatePost } from './services';
import { Post } from './models';
import BlogCard from './BlogCard';

const { Meta } = Card;

interface PostDetailProps {
	postId: number;
	onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId, onBack }) => {
	const [post, setPost] = useState<Post | null>(null);
	const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

	useEffect(() => {
		const foundPost = getPostById(postId);
		if (foundPost) {
			setPost(foundPost);
			// Tăng view count
			const updatedPost = { ...foundPost, views: foundPost.views + 1 };
			updatePost(postId, updatedPost);
			setPost(updatedPost);

			// Bài viết liên quan
			const related = foundPost.tags
				.flatMap((tag) => getPostsByTag(tag))
				.filter((p) => p.id !== postId)
				.slice(0, 3);
			setRelatedPosts(related);
		}
	}, [postId]);

	if (!post) {
		return <div>Loading...</div>;
	}

	return (
		<div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				{/* Nút Quay lại */}
				<Button icon={<ArrowLeftOutlined />} onClick={onBack}>
					Quay lại danh sách
				</Button>

				{/* Thông tin bài viết */}
				<Card>
					<Meta
						avatar={<Avatar icon={<UserOutlined />} />}
						title={post.title}
						description={
							<>
								<p>
									<strong>Tác giả:</strong> {post.author}
								</p>
								<p>
									<strong>Ngày đăng:</strong> {post.publishedAt}
								</p>
								<p>
									<EyeOutlined /> {post.views} lượt xem
								</p>
								<div>
									{post.tags.map((tag) => (
										<Tag key={tag} color='blue'>
											{tag}
										</Tag>
									))}
								</div>
							</>
						}
					/>
				</Card>

				{/* Nội dung bài viết */}
				<Card>
					{post.coverImage && (
						<img
							src={post.coverImage}
							alt={post.title}
							style={{ width: '100%', marginBottom: '16px', borderRadius: '8px' }}
						/>
					)}
					<ReactMarkdown>{post.content}</ReactMarkdown>
				</Card>

				{/* Bài viết liên quan */}
				{relatedPosts.length > 0 && (
					<div>
						<h3>Bài viết liên quan</h3>
						<Row gutter={16}>
							{relatedPosts.map((relatedPost) => (
								<Col key={relatedPost.id} xs={24} sm={12} md={8}>
									<BlogCard post={relatedPost} onClick={() => {}} />
								</Col>
							))}
						</Row>
					</div>
				)}
			</Space>
		</div>
	);
};

export default PostDetail;

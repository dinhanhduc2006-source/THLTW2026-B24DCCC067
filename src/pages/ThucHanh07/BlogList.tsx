import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Input, Select, Pagination, Tag as AntTag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import BlogCard from './BlogCard';
import { getPosts, getTags, searchPosts, getPostsByTag } from './services';
import { Post, Tag } from './models';

const { Option } = Select;

interface BlogListProps {
	onSelectPost: (postId: number) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onSelectPost }) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9;

	useEffect(() => {
		setPosts(getPosts());
		setTags(getTags());
	}, []);

	const debouncedSearch = useCallback(
		debounce((query: string) => {
			setSearchQuery(query);
		}, 300),
		[],
	);

	useEffect(() => {
		let filtered = posts;
		if (selectedTag) {
			filtered = getPostsByTag(selectedTag);
		}
		if (searchQuery) {
			filtered = searchPosts(searchQuery);
		}
		setFilteredPosts(filtered);
		setCurrentPage(1);
	}, [posts, selectedTag, searchQuery]);

	const paginatedPosts = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredPosts.slice(startIndex, startIndex + pageSize);
	}, [filteredPosts, currentPage, pageSize]);

	const handleTagClick = (tag: string) => {
		setSelectedTag(selectedTag === tag ? null : tag);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(e.target.value);
	};

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Input
					placeholder='Tìm kiếm bài viết...'
					prefix={<SearchOutlined />}
					onChange={handleSearchChange}
					style={{ width: 300, marginRight: 16 }}
				/>
				<Select
					placeholder='Lọc theo tag'
					style={{ width: 200 }}
					allowClear
					onChange={(value) => setSelectedTag(value)}
				>
					{tags.map((tag) => (
						<Option key={tag.name} value={tag.name}>
							{tag.name}
						</Option>
					))}
				</Select>
			</div>
			<div style={{ marginBottom: 16 }}>
				{tags.map((tag) => (
					<AntTag
						key={tag.name}
						color={selectedTag === tag.name ? 'blue' : 'default'}
						onClick={() => handleTagClick(tag.name)}
						style={{ cursor: 'pointer', marginBottom: 8 }}
					>
						{tag.name} ({tag.postCount})
					</AntTag>
				))}
			</div>
			<Row gutter={16}>
				{paginatedPosts.map((post) => (
					<Col key={post.id} xs={24} sm={12} md={8}>
						<BlogCard post={post} onClick={onSelectPost} />
					</Col>
				))}
			</Row>
			<Pagination
				current={currentPage}
				total={filteredPosts.length}
				pageSize={pageSize}
				onChange={setCurrentPage}
				style={{ marginTop: 16, textAlign: 'center' }}
			/>
		</div>
	);
};

export default BlogList;

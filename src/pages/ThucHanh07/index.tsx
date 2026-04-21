import React, { useState } from 'react';
import { Tabs } from 'antd';
import BlogList from './BlogList';
import PostDetail from './PostDetail';
import About from './About';
import ManagePosts from './ManagePosts';
import ManageTags from './ManageTags';

const { TabPane } = Tabs;

const ThucHanh07: React.FC = () => {
	const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

	const handleSelectPost = (postId: number) => {
		setSelectedPostId(postId);
	};

	const handleBackToList = () => {
		setSelectedPostId(null);
	};

	if (selectedPostId) {
		return <PostDetail postId={selectedPostId} onBack={handleBackToList} />;
	}

	return (
		<div>
			<h1>Ứng dụng Blog cá nhân</h1>
			<Tabs defaultActiveKey='1'>
				<TabPane tab='Trang chủ' key='1'>
					<BlogList onSelectPost={handleSelectPost} />
				</TabPane>
				<TabPane tab='Giới thiệu' key='2'>
					<About />
				</TabPane>
				<TabPane tab='Quản lý bài viết' key='3'>
					<ManagePosts />
				</TabPane>
				<TabPane tab='Quản lý thẻ' key='4'>
					<ManageTags />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default ThucHanh07;

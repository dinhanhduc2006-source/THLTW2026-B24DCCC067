import { Post, Tag } from './models';

const mockPosts: Post[] = [
	{
		id: 1,
		title: 'Giới thiệu về React',
		slug: 'gioi-thieu-ve-react',
		content:
			'# Giới thiệu về React\n\n![React Logo](https://via.placeholder.com/400x200)\n\nReact là một thư viện JavaScript để xây dựng giao diện người dùng...',
		excerpt: 'React là một thư viện JavaScript phổ biến để xây dựng giao diện người dùng.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Đinh Anh Đức',
		publishedAt: '2023-04-20',
		tags: ['React', 'JavaScript'],
		status: 'published',
		views: 150,
	},
	{
		id: 2,
		title: 'TypeScript cho người mới bắt đầu',
		slug: 'typescript-cho-nguoi-moi-bat-dau',
		content: '# TypeScript cho người mới bắt đầu\n\nTypeScript là một superset của JavaScript...',
		excerpt: 'Học TypeScript từ cơ bản đến nâng cao.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Trần Thị B',
		publishedAt: '2023-04-19',
		tags: ['TypeScript', 'JavaScript'],
		status: 'published',
		views: 200,
	},
	{
		id: 3,
		title: 'Hướng dẫn sử dụng Ant Design',
		slug: 'huong-dan-su-dung-ant-design',
		content: '# Hướng dẫn sử dụng Ant Design\n\nAnt Design là thư viện UI phổ biến...',
		excerpt: 'Hướng dẫn chi tiết cách sử dụng Ant Design trong dự án React.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Lê Văn C',
		publishedAt: '2023-04-18',
		tags: ['Ant Design', 'UI/UX'],
		status: 'published',
		views: 120,
	},
	{
		id: 4,
		title: 'State Management với Redux',
		slug: 'state-management-voi-redux',
		content: '# State Management với Redux\n\nRedux giúp quản lý state trong ứng dụng React...',
		excerpt: 'Cách sử dụng Redux để quản lý state hiệu quả.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Đinh Anh Đức',
		publishedAt: '2023-04-17',
		tags: ['Redux', 'State Management'],
		status: 'published',
		views: 180,
	},
	{
		id: 5,
		title: 'Next.js Fundamentals',
		slug: 'nextjs-fundamentals',
		content: '# Next.js Fundamentals\n\nNext.js là framework React cho production...',
		excerpt: 'Cơ bản về Next.js và cách sử dụng.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Trần Thị B',
		publishedAt: '2023-04-16',
		tags: ['Next.js', 'React'],
		status: 'published',
		views: 90,
	},
	{
		id: 6,
		title: 'Docker cho Developers',
		slug: 'docker-cho-developers',
		content: '# Docker cho Developers\n\nDocker giúp container hóa ứng dụng...',
		excerpt: 'Hướng dẫn sử dụng Docker trong phát triển phần mềm.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Lê Văn C',
		publishedAt: '2023-04-15',
		tags: ['Docker', 'DevOps'],
		status: 'published',
		views: 110,
	},
	{
		id: 7,
		title: 'GraphQL với React',
		slug: 'graphql-voi-react',
		content: '# GraphQL với React\n\nGraphQL là ngôn ngữ query cho API...',
		excerpt: 'Tích hợp GraphQL vào ứng dụng React.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Đinh Anh Đức',
		publishedAt: '2023-04-14',
		tags: ['GraphQL', 'React'],
		status: 'published',
		views: 85,
	},
	{
		id: 8,
		title: 'Testing React Components',
		slug: 'testing-react-components',
		content: '# Testing React Components\n\nTesting là phần quan trọng trong phát triển...',
		excerpt: 'Hướng dẫn testing component React với Jest.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Trần Thị B',
		publishedAt: '2023-04-13',
		tags: ['Testing', 'Jest'],
		status: 'published',
		views: 95,
	},
	{
		id: 9,
		title: 'Performance Optimization',
		slug: 'performance-optimization',
		content: '# Performance Optimization\n\nTối ưu hóa hiệu suất ứng dụng React...',
		excerpt: 'Các kỹ thuật tối ưu hóa hiệu suất.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Lê Văn C',
		publishedAt: '2023-04-12',
		tags: ['Performance', 'React'],
		status: 'published',
		views: 130,
	},
	{
		id: 10,
		title: 'CSS Modules trong React',
		slug: 'css-modules-trong-react',
		content: '# CSS Modules trong React\n\nCSS Modules giúp styling component...',
		excerpt: 'Sử dụng CSS Modules để styling component React.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Đinh Anh Đức',
		publishedAt: '2023-04-11',
		tags: ['CSS', 'React'],
		status: 'published',
		views: 75,
	},
	{
		id: 11,
		title: 'React Native Basics',
		slug: 'react-native-basics',
		content: '# React Native Basics\n\nReact Native để phát triển mobile app...',
		excerpt: 'Bắt đầu với React Native.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Trần Thị B',
		publishedAt: '2023-04-10',
		tags: ['React Native', 'Mobile'],
		status: 'published',
		views: 140,
	},
	{
		id: 12,
		title: 'Bài viết nháp',
		slug: 'bai-viet-nhap',
		content: '# Bài viết nháp\n\nĐây là bài viết đang trong trạng thái nháp...',
		excerpt: 'Bài viết mẫu ở trạng thái nháp.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Lê Văn C',
		publishedAt: '2023-04-09',
		tags: ['Draft'],
		status: 'draft',
		views: 0,
	},
	{
		id: 13,
		title: 'HTML và CSS Cơ bản',
		slug: 'html-va-css-co-ban',
		content: '# HTML và CSS Cơ bản\n\nHTML và CSS là nền tảng của web development...',
		excerpt: 'Học HTML và CSS từ cơ bản để xây dựng trang web.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Đinh Anh Đức',
		publishedAt: '2023-04-08',
		tags: ['HTML', 'CSS'],
		status: 'published',
		views: 160,
	},
	{
		id: 14,
		title: 'Node.js cho Backend Development',
		slug: 'nodejs-cho-backend',
		content: '# Node.js cho Backend Development\n\nNode.js cho phép chạy JavaScript ở server-side...',
		excerpt: 'Giới thiệu Node.js và cách sử dụng cho backend.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Trần Thị B',
		publishedAt: '2023-04-07',
		tags: ['Node.js', 'Backend'],
		status: 'published',
		views: 125,
	},
	{
		id: 15,
		title: 'Thiết kế API RESTful',
		slug: 'thiet-ke-api-restful',
		content: '# Thiết kế API RESTful\n\nRESTful API là cách thiết kế API hiệu quả...',
		excerpt: 'Hướng dẫn thiết kế và phát triển API RESTful.',
		coverImage: 'https://via.placeholder.com/300x200',
		author: 'Lê Văn C',
		publishedAt: '2023-04-06',
		tags: ['API', 'REST'],
		status: 'published',
		views: 105,
	},
];

const mockTags: Tag[] = [
	{ id: 1, name: 'React', postCount: 6 },
	{ id: 2, name: 'TypeScript', postCount: 1 },
	{ id: 3, name: 'JavaScript', postCount: 2 },
	{ id: 4, name: 'Ant Design', postCount: 1 },
	{ id: 5, name: 'Redux', postCount: 1 },
	{ id: 6, name: 'Next.js', postCount: 1 },
	{ id: 7, name: 'Docker', postCount: 1 },
	{ id: 8, name: 'GraphQL', postCount: 1 },
	{ id: 9, name: 'Testing', postCount: 1 },
	{ id: 10, name: 'Jest', postCount: 1 },
	{ id: 11, name: 'Performance', postCount: 1 },
	{ id: 12, name: 'CSS', postCount: 2 },
	{ id: 13, name: 'React Native', postCount: 1 },
	{ id: 14, name: 'Mobile', postCount: 1 },
	{ id: 15, name: 'UI/UX', postCount: 1 },
	{ id: 16, name: 'State Management', postCount: 1 },
	{ id: 17, name: 'DevOps', postCount: 1 },
	{ id: 18, name: 'Draft', postCount: 1 },
	{ id: 19, name: 'HTML', postCount: 1 },
	{ id: 20, name: 'Node.js', postCount: 1 },
	{ id: 21, name: 'Backend', postCount: 1 },
	{ id: 22, name: 'API', postCount: 1 },
	{ id: 23, name: 'REST', postCount: 1 },
];

export const getPosts = (): Post[] => mockPosts;

export const getPostById = (id: number): Post | undefined => mockPosts.find((post) => post.id === id);

export const getPostsByTag = (tag: string): Post[] => mockPosts.filter((post) => post.tags.includes(tag));

export const searchPosts = (query: string): Post[] =>
	mockPosts.filter(
		(post) =>
			post.title.toLowerCase().includes(query.toLowerCase()) ||
			post.excerpt.toLowerCase().includes(query.toLowerCase()),
	);

export const getTags = (): Tag[] => mockTags;

export const addPost = (post: Omit<Post, 'id'>): Post => {
	const newPost = { ...post, id: mockPosts.length + 1 };
	mockPosts.push(newPost);
	return newPost;
};

export const updatePost = (id: number, updates: Partial<Post>): Post | null => {
	const index = mockPosts.findIndex((post) => post.id === id);
	if (index !== -1) {
		mockPosts[index] = { ...mockPosts[index], ...updates };
		return mockPosts[index];
	}
	return null;
};

export const deletePost = (id: number): boolean => {
	const index = mockPosts.findIndex((post) => post.id === id);
	if (index !== -1) {
		mockPosts.splice(index, 1);
		return true;
	}
	return false;
};

export const addTag = (tag: Omit<Tag, 'id'>): Tag => {
	const newTag = { ...tag, id: mockTags.length + 1 };
	mockTags.push(newTag);
	return newTag;
};

export const updateTag = (id: number, updates: Partial<Tag>): Tag | null => {
	const index = mockTags.findIndex((tag) => tag.id === id);
	if (index !== -1) {
		mockTags[index] = { ...mockTags[index], ...updates };
		return mockTags[index];
	}
	return null;
};

export const deleteTag = (id: number): boolean => {
	const index = mockTags.findIndex((tag) => tag.id === id);
	if (index !== -1) {
		mockTags.splice(index, 1);
		return true;
	}
	return false;
};

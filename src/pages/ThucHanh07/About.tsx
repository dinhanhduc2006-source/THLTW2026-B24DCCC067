import React from 'react';
import { Card, Avatar, Tag, Space } from 'antd';
import { UserOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Meta } = Card;

const About: React.FC = () => {
	return (
		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
			<Card>
				<Meta
					avatar={<Avatar size={64} icon={<UserOutlined />} />}
					title='Đinh Anh Đức'
					description='Full-stack Developer passionate about React, TypeScript, and modern web technologies.'
				/>
				<div style={{ marginTop: 16 }}>
					<h3>Kỹ năng</h3>
					<Space wrap>
						<Tag color='blue'>React</Tag>
						<Tag color='green'>TypeScript</Tag>
						<Tag color='orange'>Node.js</Tag>
						<Tag color='purple'>Python</Tag>
						<Tag color='red'>Docker</Tag>
					</Space>
				</div>
				<div style={{ marginTop: 16 }}>
					<h3>Liên kết</h3>
					<Space>
						<a href='https://github.com/example' target='_blank' rel='noopener noreferrer'>
							<GithubOutlined style={{ fontSize: 24 }} />
						</a>
						<a href='https://linkedin.com/in/example' target='_blank' rel='noopener noreferrer'>
							<LinkedinOutlined style={{ fontSize: 24 }} />
						</a>
						<a href='mailto:example@email.com'>
							<MailOutlined style={{ fontSize: 24 }} />
						</a>
					</Space>
				</div>
			</Card>
		</div>
	);
};

export default About;

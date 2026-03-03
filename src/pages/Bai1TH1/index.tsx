import React, { useState, useEffect } from 'react';
import { Card, Input, Button, message, Typography, Alert } from 'antd';

const { Title, Text } = Typography;

const GuessNumberGame: React.FC = () => {
	const [randomNumber, setRandomNumber] = useState<number>(0);
	const [guess, setGuess] = useState<string>('');
	const [attempts, setAttempts] = useState<number>(0);
	const [history, setHistory] = useState<string[]>([]);
	const [gameOver, setGameOver] = useState<boolean>(false);

	const startNewGame = () => {
		setRandomNumber(Math.floor(Math.random() * 100) + 1);
		setAttempts(0);
		setHistory([]);
		setGuess('');
		setGameOver(false);
	};

	useEffect(() => {
		startNewGame();
	}, []);

	const handleGuess = () => {
		const num = parseInt(guess);
		if (isNaN(num) || num < 1 || num > 100) {
			message.error('Vui lòng nhập số từ 1 đến 100!');
			return;
		}

		const newAttempts = attempts + 1;
		setAttempts(newAttempts);

		let result = '';
		if (num < randomNumber) {
			result = `Lần ${newAttempts}: ${num} - Bạn đoán quá thấp!`;
		} else if (num > randomNumber) {
			result = `Lần ${newAttempts}: ${num} - Bạn đoán quá cao!`;
		} else {
			result = `Chúc mừng! Bạn đã đoán đúng số ${randomNumber}!`;
			setGameOver(true);
			message.success(result);
		}

		setHistory([result, ...history]);
		setGuess('');

		if (newAttempts >= 10 && num !== randomNumber) {
			setGameOver(true);
			message.error(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
		}
	};

	return (
		<Card title='Trò chơi đoán số (1-100)' style={{ maxWidth: 500, margin: '20px auto' }}>
			<Title level={4}>Bạn còn {10 - attempts} lượt đoán</Title>

			<Input
				type='number'
				value={guess}
				onChange={(e) => setGuess(e.target.value)}
				placeholder='Nhập số của bạn...'
				disabled={gameOver}
				onPressEnter={handleGuess}
				style={{ marginBottom: 10 }}
			/>

			<Button type='primary' onClick={handleGuess} disabled={gameOver} block>
				Đoán
			</Button>

			{gameOver && (
				<Button onClick={startNewGame} style={{ marginTop: 10 }} block>
					Chơi lại
				</Button>
			)}

			<div style={{ marginTop: 20 }}>
				{history.map((item, index) => (
					<div key={index} style={{ color: item.includes('đúng') ? 'green' : 'red' }}>
						{item}
					</div>
				))}
			</div>
		</Card>
	);
};

export default GuessNumberGame;

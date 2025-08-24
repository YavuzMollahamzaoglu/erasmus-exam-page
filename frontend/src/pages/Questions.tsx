import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

const games = [
	{
		title: 'Kelime Avı Oyunu',
		description: 'Türkçe kelimenin İngilizcesini kartlardan seç!',
		icon: (
			<svg width="48" height="48" fill="none">
				<circle cx="24" cy="24" r="20" fill="#F9D923" />
				<path
					d="M32 32l8 8"
					stroke="#19376D"
					strokeWidth="3"
					strokeLinecap="round"
				/>
				<circle cx="24" cy="24" r="10" stroke="#19376D" strokeWidth="3" />
			</svg>
		),
		color: '#F9D923',
		link: '/kelime-avi',
	},
	{
		title: 'Yazı Yazma Oyunu',
		description: 'Türkçe kelimeyi İngilizce doğru yaz!',
		icon: (
			<svg width="48" height="48" fill="none">
				<rect x="10" y="34" width="28" height="4" rx="2" fill="#36AE7C" />
				<path d="M14 34L34 14" stroke="#19376D" strokeWidth="3" />
				<rect x="32" y="12" width="4" height="8" rx="2" fill="#36AE7C" />
			</svg>
		),
		color: '#36AE7C',
		link: '/yazi-yazma',
	},
	{
		title: 'Boşluk Doldurma Oyunu',
		description: 'Paragraftaki boşlukları doğru kelimelerle doldur!',
		icon: (
			<svg width="48" height="48" fill="none">
				<rect x="8" y="12" width="32" height="24" rx="4" fill="#1877F2" />
				<rect x="12" y="16" width="24" height="4" rx="2" fill="#fff" />
				<rect x="12" y="24" width="16" height="4" rx="2" fill="#fff" />
			</svg>
		),
		color: '#1877F2',
		link: '/bosluk-doldurma',
	},
	{
		title: 'AI Essay Değerlendirici',
		description: 'AI ile essay yazın ve detaylı değerlendirme alın!',
		icon: (
			<svg width="48" height="48" fill="none">
				<rect x="6" y="10" width="36" height="28" rx="4" fill="#9C27B0" />
				<circle cx="18" cy="20" r="3" fill="#fff" />
				<circle cx="30" cy="20" r="3" fill="#fff" />
				<path
					d="M15 28c3 2 15 2 18 0"
					stroke="#fff"
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</svg>
		),
		color: '#9C27B0',
		link: '/essay-writing',
	},
];

const Questions: React.FC = () => {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: '#b2dfdb',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				pb: { xs: 7, md: 8 },
				pt: 0,
				px: 2,
			}}
		>
			<Paper
				elevation={6}
				sx={{
					p: 0,
					borderRadius: 4,
					minWidth: 340,
					width: '100%',
					maxWidth: 820,
					mt: '15px',
					background:
						'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
					transition: 'transform 0.3s ease',
				}}
			>
				{/* Gradient header merged with Paper top, inherit radii */}
				<Box
					sx={{
						background:
							'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
						color: '#fff',
						p: { xs: 3, md: 4 },
						borderTopLeftRadius: 'inherit',
						borderTopRightRadius: 'inherit',
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
						textAlign: 'center',
						position: 'relative',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'rgba(255, 255, 255, 0.1)',
							backdropFilter: 'blur(5px)',
							zIndex: 0,
						},
					}}
				>
					<Box sx={{ position: 'relative', zIndex: 1 }}>
						<Typography
							variant="h3"
							fontWeight={700}
							mb={2}
							sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: { xs: '2rem', md: '2.5rem' } }}
						>
							İngilizce Oyunları
						</Typography>
						<Typography
							variant="h6"
							sx={{ opacity: 0.9 }}
						>
							Seviyene uygun oyunu seç ve hemen başla
						</Typography>
					</Box>
				</Box>

				{/* Content wrapper with padding */}
				<Box sx={{ p: { xs: 3, md: 4 } }}>
					{/* Games grid */}
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
							gap: 2.5,
							alignItems: 'stretch',
							justifyItems: 'stretch',
						}}
					>
						{games.map((game) => (
							<Box
								key={game.title}
								sx={{
									width: '100%',
									background: 'rgba(255, 255, 255, 0.9)',
									border: '1px solid rgba(0, 184, 148, 0.2)',
									borderRadius: 3,
									boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
									p: 2.5,
									cursor: 'pointer',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									transition: 'transform 0.3s ease, box-shadow 0.3s ease',
									'&:hover': {
										boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
										transform: 'translateY(-3px)',
									},
								}}
								onClick={() => (window.location.href = game.link)}
							>
								<Box
									sx={{
										width: 72,
										height: 72,
										borderRadius: '50%',
										background: game.color,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										mb: 2,
										boxShadow: 1,
									}}
								>
									{game.icon}
								</Box>
								<Typography
									fontWeight={700}
									fontSize={18}
									mb={0.5}
									color="#00695c"
									align="center"
								>
									{game.title}
								</Typography>
								<Typography
									fontSize={14}
									color="#455a64"
									align="center"
									mb={2}
								>
									{game.description}
								</Typography>
								<Button
									variant="contained"
									sx={{
										background:
											'linear-gradient(90deg, #00b894 0%, #00cec9 100%)',
										color: '#fff',
										fontWeight: 700,
										borderRadius: 2,
										px: 3,
										py: 1.1,
										boxShadow: 2,
										textTransform: 'none',
										fontSize: 16,
										mt: 'auto',
										'&:hover': {
											background:
												'linear-gradient(90deg, #00cec9 0%, #00b894 100%)',
											boxShadow: 4,
											transform: 'scale(1.03)',
										},
									}}
									onClick={(e) => {
										e.stopPropagation();
										window.location.href = game.link;
									}}
								>
									Başla
								</Button>
							</Box>
						))}
					</Box>

					<Typography
						fontSize={15}
						color="#455a64"
						align="center"
						mt={4}
					>
						Başlamak için bir oyun seçin
					</Typography>
				</Box>
			</Paper>
		</Box>
	);
};

export default Questions;

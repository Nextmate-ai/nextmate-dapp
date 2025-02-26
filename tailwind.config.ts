import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			screens: {
				'390': '390px',
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
				jamjuree: ['Bai Jamjuree', 'sans-serif'],
				chakra: ['Chakra Petch', 'sans-serif'],
				pingfang: ['PingFang SC', 'sans-serif'],
				DigitalNumber: ['Digital Numbers', 'sans-serif'],
			},
			backgroundImage: {
				'bg-toast': 'url(/img/bg-toast.png)',
				'bg-diamond': 'url(/img/bg-diamond.png)',
				'bg-add-token-border': 'url(/img/add-token-border.png)',
				'bg-slap-sun': 'url(/img/bg-slap-sun.png)',
				'bg-equipment-border': 'url(/img/equipment-border.png)',
				'bg-equipment-item': 'url(/img/equipment-item.png)',
				'bg-chat': 'url(/img/bg-chat.png)',
				'bg-popup': 'url(/img/bg-popup.png)',
				'bg-equipment': 'url(/img/equipment.png)',
				'bg-gold': 'url(/img/bg-gold.png)',
				'bg-energy': 'url(/img/bg-energy.png)',
				'bg-balance': 'url(/img/bg-balance.png)',
				'bg-balance-panel': 'url(/img/bg-balance-panel.png)',
				'red-balance-panel': 'url(/img/red-balance-panel.png)',
				'blue-balance-panel': 'url(/img/blue-balance-panel.png)',
				'gray-balance-panel': 'url(/img/gray-balance-panel.png)',
				'orange-balance-panel': 'url(/img/orange-balance-panel.png)',
				'bg-red': 'url(/img/bg-red.png)',
				'bg-blue': 'url(/img/bg-blue.png)',
				'bg-gray': 'url(/img/bg-gray.png)',
				'bg-orange': 'url(/img/bg-orange.png)',
				'red-btn': 'url(/img/red-btn.png)',
				'blue-btn': 'url(/img/blue-btn.png)',
				'gray-btn': 'url(/img/gray-btn.png)',
				'orange-btn': 'url(/img/orange-btn.png)',
				'bg-purple': 'url(/img/bg-purple.jpg)',
				'bg-profile': 'url(/img/bg-profile.png)',
				'bg-invite': 'url(/img/bg-invite.png)',
				'bg-invite-tips': 'url(/img/bg-invite-tips.png)',
				'bg-roulette': 'url(/img/roulette/bg-roulette.png)',
				'red-roulette': 'url(/img/roulette/red-roulette.png)',
				'blue-roulette': 'url(/img/roulette/blue-roulette.png)',
				'gray-roulette': 'url(/img/roulette/gray-roulette.png)',
				'orange-roulette': 'url(/img/roulette/orange-roulette.png)',
				'bg-dotted': 'url(/img/bg-dotted.png)',
				'bg-amount': 'url(/img/bg-amount.png)',
				'bg-vote-meme': 'url(/img/bg-vote-meme.png)',
				'bg-vote-meme-full': 'url(/img/bg-vote-meme-full.png)',
				'lottery-mask': 'url(/img/roulette/bg-mask.png)',
				'lottery-bg': 'url(/img/lottery-bg.png)',
				'lottery-top': 'url(/img/lottery-top.png)',
				'lottery-process': 'url(/img/lottery-process.png)',
				'bg-home-login-btn': 'url(/img/home-login-btn.png)',
				'bg-spin-btn-active': 'url(/img/bg-spin-btn-active.png)',
				'bg-spin-btn-inactive': 'url(/img/bg-spin-btn-inactive.png)',
				'bg-slag-pepe': 'url(/img/slag/pepe/slag-bg.png)',
				'bg-invite-history': 'url(/img/invite/bg-invite-history.png)',
				'gradient-to-b':
					'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%)',
				'talking-gradient': 'linear-gradient(180deg, #6E67F6 0%, #F2BC1A 120%)',
				'text-gradient':
					'linear-gradient(180deg, #FFF 56.84%, rgba(255, 255, 255, 0.00) 118.75%)',
				'roles-gradient':
					'linear-gradient(270deg, #503fa7 0%, rgba(81, 63, 165, 0) 100%)',
				'invition-bg-top1':
					'linear-gradient(90deg, rgba(255, 225, 0, 0.60) 0%, rgba(255, 225, 0, 0.10) 100%)',
				'invition-bg-top2':
					'linear-gradient(90deg, rgba(255, 103, 97, 0.50) 0%, rgba(255, 103, 97, 0.10) 100%)',
				'invition-bg-top3':
					'linear-gradient(90deg, rgba(172, 168, 255, 0.50) 0%, rgba(172, 168, 255, 0.10) 100%)',
				'invition-bg-top4':
					'linear-gradient(90deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 100%)',
			},
			backdropFilter: {
				none: 'none',
				blur: 'blur(10px)',
			},
			// 添加自定义字体阴影
			textShadow: {
				yellow: '0px 0px 6px #FFF176',
			},
			// 添加对backdrop-filter的支持
			webkitBackdropFilter: {
				none: 'none',
				blur: 'blur(10px)',
			},
			colors: {
				'normarl-gray-bg': '#D9D9D9',
				'custom-red-001': '#F2635D33',
				'custom-red-002': '#F2635D66',
				'custom-red-003': '#F2635D99',
				'custom-red-004': '#F2635DCC',
				'custom-red-005': '#F2635D',
				'custom-red-006': '#CC534E',
				'custom-red-007': '#993F3B',
				'custom-red-008': '#662A27',
				'custom-red-009': '#331514',
				'custom-purple-001': '#6E67F633',
				'custom-purple-002': '#6E67F666',
				'custom-purple-003': '#6E67F699',
				'custom-purple-004': '#6E67F6CC',
				'custom-purple-005': '#6E67F6',
				'custom-purple-006': '#5B55CC',
				'custom-purple-007': '#444099',
				'custom-purple-008': '#2E2B66',
				'custom-purple-09': '#171533',
				'custom-purple-10': '#8D87F9',
				'custom-purple-011': '#ACA8FF',
				'custom-yellow-001': '#FCD25B33',
				'custom-yellow-002': '#FCD25B66',
				'custom-yellow-003': '#FCD25B99',
				'custom-yellow-004': '#FCD25BCC',
				'custom-yellow-005': '#FCD25B',
				'custom-yellow-006': '#CCAA4A',
				'custom-yellow-007': '#998037',
				'custom-yellow-008': '#665525',
				'custom-yellow-009': '#332B12',
				'custom-yellow-010': '#FFE716',
				'custom-gray-001': '#EFEFEF',
				'custom-gray-002': '#DFDFDF',
				'custom-gray-003': '#999999',
				'custom-blue-001': '#83DEFF',
				'bg-disConnectWallet-0.1': 'rgba(110, 103, 246, 0.1)',
				'bg-disConnectWallet-0.3': 'rgba(110, 103, 246, 0.3)',
			},
			fontSize: {
				hd1: ['36px', { fontWeight: 800 }],
				hd2: ['20px', { fontWeight: 800 }],
			},
			animation: {
				'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
				'spin-slow': 'spin 4s linear infinite',
			},
			keyframes: {
				'border-beam': {
					'100%': {
						'offset-distance': '100%',
					},
				},
				spin: {
					'100%': {
						transform: 'rotate(360deg)',
					},
				},
			},
		},
	},
	plugins: [
		require('tailwindcss-filters'), // 确保安装了tailwindcss-filters插件
		require('tailwindcss-textshadow'),
	],
};

export default config;

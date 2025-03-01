# Nextmate DApp

Decentralized AI-Driven Prediction Market:
Empowering Cryptocurrency with New Use Cases and Utility

## Features

- Multi-chain Wallet Support

    We have deployed [smart contracts](https://somnia-testnet.socialscan.io/address/0x508010006c51ba408b0b73294066b5cc7aa2ac7b) on Somnia, allowing users to participate in prediction markets, create prediction markets, and earn profits from these markets on the Somnia network.


- Telegram Integration
- Prediction Markets
- Asset Management
- Real-time Balance Display
- Multi-language Support

## Team

Fred Li, Product Manager, Tsinghua University, 4+ years of experience in product management, 3+ years of experience in Web3 industry, Worked at a top-tier venture capital firm.

Kelly Wang, Product Designer, Tsinghua University, University of Washington, 3+ years of experience in product design。

Peter Zhu, Developer, University of Southern California, 4 years of SDE in TikTok.

Leo Du, Developer, 3+ years of web3 work experience

## Tech Stack

- Next.js 14
- TypeScript
- Prisma
- Redux Toolkit
- TailwindCSS
- Web3 Integration:
  - Rainbow Kit
  - Wagmi
  - Tronweb
  - Solana Web3.js

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd nextmate-dapp
```

2. Install dependencies
```bash
pnpm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
pnpm dev
```

Visit http://localhost:3000 to view the application.

## Project Structure
```
nextmate-dapp/
├── src/
│   ├── app/           # Main application directory
│   │   ├── _components/   # Shared components
│   │   ├── contracts/    # Smart contract integration
│   │   ├── context/     # React context providers
│   │   └── api/         # API routes
│   ├── assets/        # Static assets and images
│   ├── store/         # Redux store configuration
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── prisma/           # Database schema and migrations
├── public/          # Public assets
└── types/           # Global type declarations
```

## Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm generate     # Generate Prisma client
pnpm dbpush      # Push database changes
```

## Code Style
We follow strict coding standards:
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode enabled
- Husky for pre-commit hooks

## Testing
Run tests using:
```bash
pnpm test        # Run all tests
pnpm test:watch  # Run tests in watch mode
pnpm test:coverage # Generate coverage report
```

## Deployment
We use GitHub Actions for our CI/CD pipeline:
- Automated testing on pull requests
- Linting and type checking
- Automatic deployment to staging
- Manual approval for production deployment

## Contributing
- Fork the project
- Create your feature branch ( git checkout -b feature/AmazingFeature )
- Commit your changes ( git commit -m 'Add some AmazingFeature' )
- Push to the branch ( git push origin feature/AmazingFeature )
- Open a Pull Request

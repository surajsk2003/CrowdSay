# CrowdSay - Social Voting Platform

A modern social voting platform built with Next.js, Firebase, and TypeScript. Create polls, vote on trending topics, and see real-time results.

## Features

- 🗳️ Create and vote on polls
- 📊 Real-time vote updates
- 🏷️ Category-based filtering
- 📱 Mobile-responsive design
- 🔥 Trending algorithm
- ⏰ Automatic poll expiry
- 👤 Anonymous and authenticated voting
- 🚀 Serverless architecture

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **UI Components**: Lucide React icons, React Hot Toast
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Firebase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd crowdsay-platform
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Anonymous + Email/Password)
4. Create Firestore database
5. Copy your config from Project Settings > General

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.local.example .env.local
```

### 4. Firestore Security Rules

Add these rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Polls - readable by all, writable by authenticated users
    match /polls/{pollId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Votes - writable by authenticated users only
    match /votes/{voteId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Users - readable/writable by owner only
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deploy

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── Header.tsx       # Navigation header
│   ├── PollCard.tsx     # Individual poll display
│   ├── PollList.tsx     # Poll list with filters
│   └── CreatePoll.tsx   # Poll creation form
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utility libraries
│   ├── firebase.ts      # Firebase config
│   └── firestore.ts     # Firestore operations
└── types/               # TypeScript types
    └── index.ts         # Global type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

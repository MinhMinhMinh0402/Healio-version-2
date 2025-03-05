# HEALIO - Smart Healthcare Platform

HEALIO is a cutting-edge healthcare platform leveraging multi-AI technology to provide intelligent, personalized health management and diagnostic support.

## Features

- Real-time health monitoring dashboard
- AI-powered symptom analysis
- Appointment scheduling system
- Comprehensive health records management
- Secure authentication system

## Technology Stack

- Frontend: React.js with Tailwind CSS
- Backend: Express.js
- AI Integration: Multiple AI providers (Gemini, OpenAI)
- Styling: shadcn/ui components
- State Management: TanStack Query

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd healio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
GOOGLE_AI_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utilities and helpers
│   │   └── pages/     # Page components
├── server/            # Backend Express application
│   ├── routes.ts     # API routes
│   └── ai-service.ts # AI integration service
└── shared/           # Shared types and schemas
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

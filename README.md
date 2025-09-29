# HeyGen LiveKit Demo

An interactive avatar demo application that integrates HeyGen's AI avatars with LiveKit's real-time video streaming capabilities. This demo showcases real-time avatar interactions with both chat-based AI responses and direct speech repetition.

## 🎯 Features

- **Real-time Avatar Streaming**: Connect to HeyGen avatars via LiveKit WebRTC
- **Interactive Chat**: Engage with AI-powered avatar responses
- **Speech Repetition**: Direct text-to-speech functionality
- **Session Management**: Create, start, and stop avatar sessions
- **Responsive UI**: Clean, modern interface built with Tailwind CSS

## 🚀 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **LiveKit Client** - WebRTC streaming
- **HeyGen API** - AI avatar integration
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- HeyGen API Key

## ⚙️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/umrasghar/heygen-demo.git
   cd heygen-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   HEYGEN_API_KEY=your_heygen_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

1. **Start Avatar Session**: Click "Start Avatar Session" to create and connect to a HeyGen avatar
2. **Wait for Connection**: The avatar video will appear once the LiveKit connection is established
3. **Choose Interaction Mode**:
   - **Chat Mode**: Ask questions and get AI-powered responses
   - **Repeat Mode**: Enter text for the avatar to speak directly
4. **Send Messages**: Type your message and click "Send"
5. **End Session**: Click "End Session" to disconnect and stop the avatar

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── create-session/     # Create HeyGen session
│   │   ├── start-avatar/       # Start avatar streaming
│   │   ├── stop-avatar/        # Stop avatar session
│   │   └── send-message/       # Send messages to avatar
│   ├── hooks/
│   │   └── useAvatarSession.ts # Custom hook for session management
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page component
│   └── globals.css             # Global styles
├── public/                     # Static assets
└── package.json               # Dependencies and scripts
```

## 🔧 API Endpoints

- `POST /api/create-session` - Create a new HeyGen session
- `POST /api/start-avatar` - Start the avatar streaming
- `POST /api/stop-avatar` - Stop the avatar session
- `POST /api/send-message` - Send messages to the avatar

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your `HEYGEN_API_KEY` to environment variables
4. Deploy!

### Other Platforms
This Next.js app can be deployed to any platform that supports Node.js applications.

## 📚 Learn More

- [HeyGen API Documentation](https://docs.heygen.com/)
- [LiveKit Documentation](https://docs.livekit.io/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for demonstration purposes.

---

Built with ❤️ using HeyGen and LiveKit

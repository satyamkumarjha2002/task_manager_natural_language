# AI Meeting Minutes to Task Converter

A modern Next.js application that transforms meeting minutes into actionable tasks using AI-powered extraction with OpenAI GPT and Firebase backend.

## 🚀 Live Demo
Transform your meeting transcripts into organized tasks with just a few clicks!

## ✨ Features

### Core Functionality
- **AI-Powered Task Extraction**: Uses OpenAI GPT-3.5-turbo to intelligently parse meeting minutes
- **Smart Task Analysis**: Automatically identifies task descriptions, assignees, deadlines, and priorities
- **Real-time Processing**: Extract multiple tasks from natural language in seconds
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete) for all tasks

### Task Management
- **Edit Tasks**: Modify task details both before and after saving
- **Task Completion**: Track task status with visual indicators
- **Priority System**: P1 (High), P2 (Medium), P3 (Low) priority levels
- **Delete Confirmation**: Elegant confirmation dialogs using shadcn/ui
- **Task Statistics**: Real-time dashboard with task counts and completion status

### User Experience
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Automatic theme detection
- **Loading States**: Smooth loading indicators and error handling
- **Glassmorphism Design**: Beautiful backdrop blur effects and gradients

### Authentication & Data
- **Firebase Authentication**: Secure user login and registration
- **Firestore Database**: Real-time data synchronization
- **User-specific Tasks**: Each user sees only their own tasks
- **Persistent Storage**: Tasks are saved permanently to the cloud

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel/Netlify

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Firebase project set up
- Git installed

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task_manager_natural_language
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# OpenAI Configuration
NEXT_PUBLIC_OPEN_AI_KEY=sk-your-openai-api-key-here

# Firebase Configuration (already configured in the app)
# Project ID: noteskeeping-30144
# API Key: AIzaSyDBrruLHVVpao5uIeZYmDXkTKgcusGigv8
```

**Important**: Replace `sk-your-openai-api-key-here` with your actual OpenAI API key.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 Usage Guide

### Step 1: Authentication
- Sign up or log in using Firebase Authentication
- Your tasks are automatically associated with your account

### Step 2: Extract Tasks from Meeting Minutes
1. Paste your meeting transcript in the input field
2. Example input:
   ```
   "Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight. This is high priority."
   ```
3. Click "Extract Tasks with AI"
4. AI will automatically parse and extract tasks

### Step 3: Review and Edit
- Review extracted tasks in the preview table
- Edit task details using the "Edit" button
- Remove unwanted tasks using the "Remove" button
- Save tasks to your database

### Step 4: Manage Your Tasks
- View all saved tasks in the "Your Tasks" section
- Edit existing tasks anytime
- Mark tasks as complete
- Delete tasks with confirmation dialogs
- Track progress with the task summary dashboard

## 🤖 AI Task Extraction

The AI analyzes meeting minutes and extracts:

- **Task Description**: Clear, actionable task statements
- **Assignee**: Person responsible for the task
- **Deadline**: Original deadline format (e.g., "tonight", "tomorrow", "Wednesday")
- **Priority**: P1 (urgent), P2 (medium), P3 (low) - defaults to P3

### Example Input:
```
"John needs to finish the user authentication by Friday. Sarah should review the database schema by tomorrow evening - this is urgent. Mike will deploy the staging environment next Monday."
```

### AI Output:
| Task | Assignee | Deadline | Priority |
|------|----------|----------|----------|
| Finish the user authentication | John | Friday | P3 |
| Review the database schema | Sarah | Tomorrow evening | P1 |
| Deploy the staging environment | Mike | Next Monday | P3 |

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Main dashboard
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── EditTaskDialog.tsx
│   └── EditExtractedTaskDialog.tsx
├── hooks/                # Custom React hooks
│   └── useAuth.tsx       # Authentication hook
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── firestore.ts      # Database operations
│   └── utils.ts          # OpenAI integration
└── types/                # TypeScript type definitions
    └── task.ts           # Task interfaces
```

## 🔐 Firebase Configuration

The app is pre-configured with Firebase:

- **Project ID**: `noteskeeping-30144`
- **API Key**: `AIzaSyDBrruLHVVpao5uIeZYmDXkTKgcusGigv8`
- **Authentication**: Email/password login
- **Database**: Firestore with user-specific collections

## 🎨 UI Components

Built with modern, accessible components:

- **Cards**: Glassmorphism design with backdrop blur
- **Tables**: Responsive task displays with actions
- **Dialogs**: Modal forms for editing and confirmations
- **Buttons**: Loading states and disabled states
- **Badges**: Priority indicators with color coding
- **Alerts**: Confirmation dialogs for destructive actions

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `out` directory to Netlify
3. Configure environment variables

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your OpenAI API key is valid
3. Ensure Firebase configuration is correct
4. Check network connectivity for API calls

## 🔮 Future Enhancements

- Integration with calendar apps for deadline reminders
- Team collaboration features
- Advanced AI models for better task extraction
- Mobile app development
- Slack/Discord bot integration
- Export tasks to popular project management tools

---

Built with ❤️ using Next.js, OpenAI, and Firebase
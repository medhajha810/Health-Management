# Health Management System

<div align="center">
  <img src="https://img.freepik.com/free-vector/health-medical-app-online-mobile-phone_23-2148636827.jpg" alt="Health Management System Logo" width="300"/>
  <p><em>A secure, intelligent platform for managing your healthcare records</em></p>
</div>

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [User Guide](#user-guide)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## 🌟 Overview

Health Management System is a comprehensive platform built on the Internet Computer (IC) blockchain that empowers users to securely store, manage, and share their health records. With features like ABHA integration, AI-powered disease prediction, and an intuitive interface, it transforms how individuals interact with their healthcare data.

The application prioritizes security, privacy, and user experience while leveraging the decentralized benefits of the Internet Computer to ensure your health data remains under your control.

## 🔑 Key Features

### Core Functionality
- **📊 Secure Health Record Management**: Create, store, view, and manage all your health records in one place
- **🔄 Cross-Provider Data Sharing**: Securely share records with healthcare providers
- **🔐 Blockchain-Based Security**: Utilize Internet Computer's secure architecture for data protection
- **📱 Responsive Design**: Access your health data seamlessly across desktop and mobile devices

### Advanced Features
- **🇮🇳 ABHA Integration**: Connect with India's Ayushman Bharat Health Account system for national health ID compatibility
- **🧠 AI Disease Prediction**: Get preliminary diagnosis suggestions through our integrated AI assistant
- **🌓 Dark/Light Mode**: Customize your visual experience to reduce eye strain
- **📅 Appointment Tracking**: Manage your medical appointments and receive reminders
- **⚡ Offline Capability**: Access critical information even without an internet connection

### User Experience
- **🎨 Intuitive Interface**: Easy-to-navigate dashboard with visual health summaries
- **✨ Smooth Animations**: Polished user experience with Framer Motion animations
- **📊 Visual Data Representation**: View your health trends through interactive charts
- **🔔 Notification System**: Stay informed about important health updates

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI)
- **Animation**: Framer Motion
- **State Management**: React Context API
- **Styling**: Emotion (CSS-in-JS)

### Backend
- **Platform**: Internet Computer (IC)
- **Language**: Rust
- **Authentication**: Internet Identity
- **Data Storage**: Internet Computer Canisters

### DevOps
- **Build Tool**: DFX (DFINITY Canister SDK)
- **Package Manager**: npm
- **Version Control**: Git

## 🔗 Live Demo

Experience the application: [Health Management System](https://bkyz2-fmaaa-aaaaa-qaaaq-cai.raw.ic0.app/)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) (DFINITY Canister SDK v0.12.0 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (for backend development)
- [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) (Rust package manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Health-Management.git
   cd Health-Management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local Internet Computer replica**:
   ```bash
   dfx start --background
   ```

4. **Deploy the canisters to the local replica**:
   ```bash
   dfx deploy
   ```

5. **Open the application**:
   Once deployed, the terminal will display a URL (typically http://localhost:4943?canisterId=...). Open this URL in your browser.

## 💻 Development

### Frontend Development

The frontend code is located in the `src/Health-Management-frontend` directory.

1. **Start the development server**:
   ```bash
   cd src/Health-Management-frontend
   npm run dev
   ```
   This will start a development server at http://localhost:8080 with hot-reloading.

2. **Build the frontend**:
   ```bash
   npm run build
   ```
   This creates optimized production files in the `dist` folder.

### Backend Development

The backend code is located in the `src/healthchain_backend` directory.

1. **Modify the Rust canister code** in `src/healthchain_backend/src/lib.rs`

2. **Update the Candid interface** after making changes:
   ```bash
   npm run generate
   ```

3. **Redeploy the backend**:
   ```bash
   dfx deploy healthchain_backend
   ```

### Key Files and Directories

- `src/Health-Management-frontend/src/component/` - React components
- `src/Health-Management-frontend/src/App.tsx` - Main application component
- `src/healthchain_backend/src/lib.rs` - Rust canister implementation
- `dfx.json` - Project configuration for Internet Computer

## 📤 Deployment

### Local Deployment

To deploy the application to the local replica:

```bash
dfx deploy
```

### Internet Computer Mainnet Deployment

1. **Create a cycles wallet** if you don't have one:
   ```bash
   dfx identity --network ic new-wallet
   ```

2. **Ensure you have sufficient cycles** in your wallet.

3. **Deploy to the Internet Computer mainnet**:
   ```bash
   dfx deploy --network ic
   ```

4. **Access your deployed application** at the URL provided in the deployment output.

## 📖 User Guide

### Setting Up Your Account

1. Open the application and click "Sign Up" or "Login" to authenticate using Internet Identity
2. Complete your profile information
3. Link your ABHA ID (optional)

### Managing Health Records

1. Click "Add New Record" on the dashboard
2. Fill in the required information about your health record
3. Attach any relevant documents or images
4. Save the record

### Using Disease Prediction

1. Click "Try Disease Prediction" on the dashboard
2. Enter your symptoms and health information
3. Review the AI-generated predictions
4. Share results with your healthcare provider if needed

### Sharing Records

1. Navigate to the record you want to share
2. Click "Share Record"
3. Enter the recipient's details or select from your healthcare providers
4. Set permissions and expiration date

## 🏗️ Architecture

The Health Management System follows a client-server architecture built on the Internet Computer:

- **Frontend**: React application that provides the user interface
- **Backend**: Rust canisters that handle data storage, retrieval, and business logic
- **Authentication**: Internet Identity for secure, anonymous authentication
- **Storage**: Internet Computer canisters for immutable, secure data storage

### Data Flow

1. User authenticates via Internet Identity
2. Frontend communicates with backend canisters via Candid interface
3. Backend stores and retrieves data from canisters
4. Updates are propagated to the frontend in real-time

## ❓ Troubleshooting

### Deployment Issues

#### Permission Errors (IC0406)

If you encounter the error "Caller does not have Prepare permission, error code IC0406" during deployment, follow these steps:

1. **Check which identity you're using**:
   ```bash
   dfx identity list
   ```
   The currently active identity will be marked with an asterisk (*).

2. **Get your principal ID**:
   ```bash
   dfx identity get-principal
   ```

3. **Check the canister controllers**:
   ```bash
   dfx canister info Health-Management-frontend
   ```

4. **Add your identity as a controller**:
   ```bash
   dfx canister update-settings Health-Management-frontend --add-controller $(dfx identity get-principal)
   ```

5. **If the above doesn't work, try stopping and restarting the replica**:
   ```bash
   dfx stop
   dfx start --clean --background
   ```

6. **If issues persist, try recreating the canister**:
   ```bash
   dfx canister delete Health-Management-frontend
   dfx deploy Health-Management-frontend
   ```

#### Security Policy Warnings

If you see warnings about security policies, create a `.ic-assets.json5` file in the project root:

```json
[
  {
    "match": "**/*",
    "security_policy": "standard"
  }
]
```

### Common Runtime Issues

- **"Cannot find Internet Identity canister"**: Ensure you've deployed the Internet Identity canister with `dfx deploy internet_identity`
- **Frontend not connecting to backend**: Check that the canister IDs in `.env` match the deployed canisters
- **Page not loading**: Clear browser cache and try again, or check browser console for errors

## 👥 Contributing

We welcome contributions to the Health Management System! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

Please ensure your code follows our coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [DFINITY Foundation](https://dfinity.org/) for the Internet Computer platform
- [Material-UI](https://mui.com/) for the UI components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Ayushman Bharat Digital Mission](https://abdm.gov.in/) for ABHA specifications
- All contributors who have helped shape this project

---

<div align="center">
  <p>Made with ❤️ by the Health Management System Team</p>
</div>

Welcome to your new `Health-Management` project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `Health-Management`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Rust Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [ic-cdk](https://docs.rs/ic-cdk)
- [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
- [Candid Introduction](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd Health-Management/
dfx help
dfx canister --help
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor

# 🚗 React Native Renter App

![React Native](https://img.shields.io/badge/React%20Native-0.74.3-61DAFB?logo=react&logoColor=white&labelColor=black&color=282c34) ![Expo](https://img.shields.io/badge/Expo-51.0.22-000020?logo=expo&logoColor=white&labelColor=000020) ![Firebase](https://img.shields.io/badge/Firebase-10.12.4-FFCA28?logo=firebase&logoColor=white&labelColor=black&color=282c34)

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Additional Notes](#additional-notes)

## 🚀 Introduction

**React Native Renter App** is a mobile application designed for individuals to search for available vehicles and manage their reservations effortlessly. Built using React Native, this app utilizes Firebase for authentication and data storage, ensuring a secure and seamless experience. The app incorporates geolocation features using Expo Location, providing users with location-based services.

## 🌟 Features

- **🔐 User Authentication**: Secure login for renters, powered by Firebase Authentication.
- **🔍 Search Vehicles**: Find available vehicles based on location and other criteria.
- **📅 Manage Reservations**: View, approve, or decline reservation requests.
- **📍 Geolocation Services**: Locate available vehicles and display them on a map.
- **💻 Responsive UI**: Provides a smooth user experience across all devices with React Native components.

## 🛠️ Prerequisites

Ensure you have the following installed before proceeding:

- **Node.js**: Version 14 or later
- **npm**: Version 6 or later (or Yarn)
- **Expo CLI**: Install via `npm install -g expo-cli`
- **Firebase Account**: Create a project in the [Firebase Console](https://console.firebase.google.com/)

## 🔧 Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/htrap5283/react-native-renter-app.git
   cd react-native-renter-app
   ```


Install Dependencies

Using npm:

```bash

npm install
```
Using Yarn:

```bash

yarn install
```

Set Up Firebase

Create a Firebase project in the Firebase Console.
Add a web app to your Firebase project.
Set up Firestore Database and Authentication in the Firebase project.
Obtain your Firebase configuration and replace it in config/FirebaseConfig.js.
Environment Configuration

Replace sensitive information such as Firebase API keys in config/FirebaseConfig.js and other configuration files.

🏃 Running the App
To start the development server and run your app on any device using Expo's tunnel feature, use the following command:

bash
Copy code
npx expo start --tunnel
Steps:
Start the Expo Development Server:

Run the following command in the root directory of your project:

bash
Copy code
npx expo start --tunnel
This command will start the Expo development server with tunnel mode enabled, allowing you to access the app from any device over the internet.

Open the Expo Go App:

Download and install the Expo Go app on your mobile device from the Google Play Store or the Apple App Store.
Scan the QR code displayed in your terminal or browser using the Expo Go app to open the project on your device.
Run on Android Emulator or iOS Simulator (optional):

If you prefer to run the app on an emulator or simulator, you can choose the corresponding option in the terminal:

Press a to open the app in the Android emulator.
Press i to open the app in the iOS simulator (macOS only).
Run on Web:

To run your app on the web, simply press w in the terminal after starting the Expo development server. This will open your app in a web browser.

📁 Project Structure
Here's a brief overview of the project's file structure:
```
react-native-renter-app
├── assets                    # Static assets like images and fonts
│   ├── images                # Image files
│   └── fonts                 # Font files
├── components                # Reusable components
│   ├── Button.js             # Custom Button component
│   └── Header.js             # Custom Header component
├── config                    # Configuration files (e.g., Firebase)
│   └── FirebaseConfig.js     # Firebase configuration
├── screens                   # Application screens
│   ├── SignInScreen.js       # Sign-in screen component
│   ├── SearchScreen.js       # Search vehicles screen component
│   └── ReservationsScreen.js # Reservations management screen component
├── App.js                    # Entry point of the application
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```

📦 Dependencies
The project uses the following major dependencies:

React Native: Core framework for building the app.
Expo: Managed workflow for React Native development.
Firebase: Backend services for authentication and database.
React Navigation: Navigation library for managing screens and tabs.
Expo Location: For accessing device location and geocoding.
React Native Maps: For displaying maps and location markers.
Refer to package.json for the complete list of dependencies and their versions.

⚙️ Configuration
Ensure your Firebase configuration is set correctly in config/FirebaseConfig.js:

FirebaseConfig.js file:
```javascript
Copy code
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import necessary firebase service
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Instantiate auth object
const auth = getAuth(app);

// Instantiate firestore object
const db = getFirestore(app);

// Export the auth and db object to use in app
export { auth, db };
```

🧑‍💻 Usage
Here's a brief guide on how to use the app:

Sign-In
Open the app and enter your credentials on the Sign-In screen to access the renter's dashboard.
Only users with the "renter" user type will have access to the app's features.
Search Vehicles
Navigate to the "Search" tab.
View available vehicles on the map.
Tap on a vehicle marker to view details and proceed to booking.
Manage Reservations
Navigate to the "Reservations" tab to view and manage your reservations.
View details of each reservation, including status and booking information.
📸 Screenshots
Search Vehicles Screen

Reservations Screen


🤝 Contributing
Contributions are always welcome! Here are some ways you can help:

Reporting Bugs: Use the issue tracker to report bugs.
Suggesting Enhancements: Propose improvements or new features.
Pull Requests: Fork the repository and submit pull requests.
Pull Request Process
Fork the repository.
Create a new branch (git checkout -b feature/YourFeatureName).
Make your changes and commit (git commit -m 'Add some feature').
Push to the branch (git push origin feature/YourFeatureName).
Open a pull request.
Please ensure your code follows the project's coding style and includes relevant documentation.

📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

📬 Contact
If you have any questions or feedback, feel free to reach out:

Email: parthjp5283@gmail.com
GitHub: htrap5283

🔍 Additional Notes
Firebase Security Rules: Ensure your Firestore and Authentication security rules are set appropriately to protect user data.
Expo Updates: Stay up to date with the latest Expo SDK versions to benefit from new features and security improvements.

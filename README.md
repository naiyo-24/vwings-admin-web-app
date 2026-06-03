# VWings24x7 Admin Application

A modern, responsive web application for administrators of the VWings24x7 platform. This application provides tools for managing teachers, students, courses, fees, salaries, announcements, and other administrative tasks.

## 🚀 Key Features

*   **Dashboard:** High-level overview of platform metrics and activities.
*   **User Management:** Manage teacher and student accounts, permissions, and details.
*   **Financial Management:** Oversee fee collections, teacher salaries, and payouts.
*   **Content Management:** Manage courses, subjects, announcements, and advertisements.
*   **Help Center:** Manage and respond to support enquiries.
*   **Global Search:** Efficient server-side search across all administrative tables.
*   **Responsive Design:** Fully responsive interface optimized for desktop, tablet, and mobile viewing.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19
*   **Build Tool:** Vite
*   **Routing:** React Router v7
*   **Styling:** Custom CSS (with a comprehensive Design System)
*   **Icons:** Lucide React
*   **Animations:** Framer Motion
*   **Rich Text Editor:** React Quill New
*   **Notifications:** React Hot Toast

## ⚙️ Local Development Setup

Follow these steps to set up the project locally:

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd VWings24x7-Admin-App
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and configure the necessary environment variables.
    ```env
    VITE_API_BASE_URL=https://appbackend.vwings247.me
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  **Access the application:**
    Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

## 📁 Project Structure

*   `src/components/`: Reusable UI components (e.g., DataTables, Modals).
*   `src/screens/`: Main application pages and views.
*   `src/theme.js`: Centralized theme configuration and styling constants.
*   `src/App.jsx`: Main application component and routing configuration.
*   `src/main.jsx`: Application entry point.

## 📜 Available Scripts

*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the app for production.
*   `npm run lint`: Runs ESLint.
*   `npm run preview`: Previews the production build.

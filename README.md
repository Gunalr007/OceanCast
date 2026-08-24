# Ocean Cast - Predictive Maritime Engine

Ocean Cast is an advanced maritime dashboard and AI-driven predictive engine designed to optimize vessel chartering, track live ocean routes, and analyze global cargo demand. The platform leverages simulated machine learning logic to provide real-time recommendations based on port data, UN Comtrade data, weather patterns, and Baltic freight trends.

## 🚀 Key Features

*   **Live Ocean Map:** Interactive global map powered by CartoDB Voyager tiles, tracking active shipping routes and real-time vessel locations.
*   **AI Decision Matrix & Logic Trace:** A live data feed providing `CHARTER` or `WAIT` decisions for specific routes. Includes an interactive "Why?" trace drawer that breaks down the ML logic step-by-step.
*   **Cargo Demand & Forecast Analysis:** Interactive charting and data visualization for filtering demand by Commodity, Region, and Forecast Period.
*   **Vessel Chartering:** Live fleet availability tracking with actionable "Charter" workflows.
*   **Customizable UI:** Supports seamless transition between Light and Dark themes, as well as real-time language localization (English, Spanish, French, Mandarin).

## 🛠️ Tech Stack

**Frontend:**
*   React.js (Vite)
*   Recharts (Data Visualization)
*   Lucide React (Iconography)
*   Leaflet.js (Map Integration)
*   CSS3 Variables for advanced theming

**Backend:**
*   Node.js & Express.js
*   MongoDB (Mongoose)
*   RESTful Mock APIs

## 📦 Prerequisites

Before running the project, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16+)
*   [MongoDB](https://www.mongodb.com/) (Running locally on `mongodb://localhost:27017`)

## ⚙️ Installation & Setup

### 1. Database Setup
Ensure your local MongoDB instance is running. The server will connect to `mongodb://localhost:27017/oceancast`.

### 2. Backend (Server)
Open a terminal, navigate to the `server` directory, install dependencies, seed the database, and start the development server:

```bash
cd server
npm install
node seed.js    # Only required the first time to populate mock data
npm run dev
```
*The backend server will run on **http://localhost:5000**.*

### 3. Frontend (Client)
Open a new terminal, navigate to the `client` directory, install dependencies, and start the React app:

```bash
cd client
npm install
npm run dev
```
*The frontend client will run on **http://localhost:5173**.*

## 🌐 Usage

1. Navigate to `http://localhost:5173` in your browser.
2. Explore the **Live Ocean Map** for vessel tracking.
3. Check the **Live Data Feed** and click **"Why?"** to see the Logic Trace for AI decision-making.
4. Go to **Settings** to toggle between Dark/Light mode and test the localization features.

## 📜 License
This project is completely yours and free to use.

# TechTalks 2024 Event Website

A responsive, single-page application to display the schedule for a 1-day technical event. Built with Node.js and Vanilla JavaScript.

## Features

- **Dynamic Schedule**: Automatically calculates talk timings, including transitions and lunch breaks.
- **Search Filtering**: Real-time filtering of talks by category (e.g., Cloud, AI, CSS).
- **Responsive Design**: Optimized for both desktop and mobile viewing.
- **Data-Driven**: Event content is managed via a simple JSON file (`talks.json`).

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data**: JSON

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (Node Package Manager)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/chadvenables/vibe-event-talks-app.git
    cd vibe-event-talks-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

1.  Start the development server:
    ```bash
    npm start
    ```

2.  Open your browser and navigate to:
    `http://localhost:3000`

## Project Structure

```text
/
├── public/
│   ├── index.html    # Main HTML file
│   ├── styles.css    # Stylesheet
│   ├── script.js     # Frontend logic (schedule calculation, search)
│   └── talks.json    # Event data (talks, speakers, descriptions)
├── server.js         # Express server entry point
├── package.json      # Project configuration and dependencies
└── README.md         # Project documentation
```

## Customization

To modify the event schedule, edit `public/talks.json`. You can add new talks or update existing ones. The application will automatically recalculate the timings based on the configured start time and durations in `script.js`.

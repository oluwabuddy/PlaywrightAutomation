# PlaywrightAutomation

This repository contains an automation project using Playwright with C#. The project demonstrates navigating through [Miacademy](https://miacademy.co/#/) and performing various automated tasks.

## Project Structure

- **Program.cs**: Main entry point of the application where the automation scripts are executed.
- **Configuration**: Directory containing configuration files.

## Prerequisites

- [.NET Core SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/)

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/oluwabuddy/PlaywrightAutomation.git
   cd PlaywrightAutomation

2. Install dependencies:
   ```sh
   npm install
   dotnet restore

3. Install Playwright browsers:
   ```sh
   npx playwright install


## Running Tests
   
4. To run the tests, use the following command:
   ```sh
   dotnet run

## Project Features
 -**Automated Navigation**:  Navigate to specific web pages and perform actions like clicking buttons and filling out forms.
 
 -**Cross-browser Testing**:  Test your web application across different browsers.
 
 -**Headless Mode**:  Run tests in headless mode for faster execution.

## Troubleshooting
 Ensure all dependencies are installed correctly.
 Check the .gitignore file to avoid committing unnecessary files like node_modules.

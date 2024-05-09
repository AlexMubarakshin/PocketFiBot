# PocketFiBot

PocketFiBot is a script designed to claim mining reward from PocketFi.

## Requirements

This project requires Node.js version 20. If you do not have it installed, you can download it from [Node.js official website](https://nodejs.org/).

## Installation

1. Clone the repository: `git clone git@github.com:AlexMubarakshin/PocketFiBot.git`
2. Navigate into the project directory: `cd PocketFiBot`
3. Copy `.env.example` to `.env`
3. Insert `telegramRawdata` from web application to `.env`


## Usage

```bash
npm start
```

## Usage in github action


This project includes a GitHub Actions workflow that automatically runs the script. The workflow is defined in `.github/workflows/pipeline.yml`.

To use the workflow:

1. Fork the repository
2. Push your changes to the repository. The workflow will run automatically.
3. To manually trigger the workflow, go to the "Actions" tab in your GitHub repository, select the workflow, and click "Run workflow".

Please ensure that your environment variables are properly set up in your GitHub repository secrets and variables through the GitHub (`Settings / Secrets and variables / Actions`) for the workflow to work correctly.
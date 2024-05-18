# PocketFiBot

PocketFiBot is a script designed to claim mining reward from PocketFi.

## Features

- **Automated Mining:** The script automatically mines rewards from PocketFi for each configured account.
- **Multiple Accounts:** The script supports multiple accounts. Each account can be configured with its own User-Agent and raw data.
- **Configurable Parameters:** The script allows you to configure various parameters such as the referrer URL, API root URL, minimum mining amount, and whether to show log messages.
- **GitHub Actions Integration:** The project includes a GitHub Actions workflow that automatically runs the script. This allows you to schedule the script to run at specific times without needing to manually start it.

## Requirements

This project requires Node.js version 20. If you do not have it installed, you can download it from [Node.js official website](https://nodejs.org/).

## Installation

1. Clone the repository: `git clone git@github.com:AlexMubarakshin/PocketFiBot.git`
2. Navigate into the project directory: `cd PocketFiBot`
3. Copy `.env.example` to `.env`
4. Insert `telegramRawdata` from web application to `.env`

## Configuration


Environment variables are used for configuration:

- `CONTINUOUS_RUN_MODE`: Set to `1` to enable continuous run mode, causing the script to run indefinitely. If set to `0` or not set, the script will run once and exit.
- `CONTINUOUS_RUN_MODE_TIMEOUT_MINS`: Sets the timeout between each run in continuous run mode (in minutes). (default: is between 20 and 30 minutes.)
- `REFFERER_URL`: The referrer URL used in requests
- `API_ROOT_URL`: The root URL of the API
- `MIN_MINING_AMOUNT`: The minimum mining amount to start withdrawal (default: 0.25)
- `SHOW_LOGS_MESSAGES`: Whether to show log messages (default: true)

Additionally, you need to set environment variables for each account you want to use. The variables should be in the following format:

- `ACCOUNT_<number>_USER_AGENT`: The User-Agent for the account
- `ACCOUNT_<number>_TG_RAW_DATA`: The raw data for the account

For example:

- `ACCOUNT_1_USER_AGENT=Mozilla/5.0 (...)`
- `ACCOUNT_1_TG_RAW_DATA=query_id=1234&user=...`

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

## ❤️ Donate

`0x75aB5a3310B7A00ac4C82AC83e0A59538CA35fEE`

<h1 style="text-align:center;">Discord Challonge Bot</h1>

# Introduction

Discord bot made to interact with Challonge tournament management website.

This project is a work-in-progress.

## Installation, Build and Run
1) Clone the repository then create a file named `.env` and fill it out accordingly
```js
TOKEN=YOURTOKENHERE
CLIENT_ID=BOTS CLIENT ID
PREFIX=!
MONGO_URI=YOUR MONGO CONNECTION STRING
MONGO_DATABASE_NAME=YOUR DATABASE NAME
```
2) Install typescript, To install TypeScript, you can run the following command in your terminal, This will install the latest version of TypeScript globally on your computer. (You can skip this if you already have typescript installed)
  ```ts
  npm install -g typescript
  ```
3) Compile your TypeScript code to JavaScript by running the following command:
```js
tsc
```
4) Once the build is complete it will generated a folder named `build` that contains compiled version of your ts code to js. You can run the following command in your terminal to run the project:
```js
npm start
```

# Changes:

## New Startup procedure:

```bash
# In one window
npm run build:watch 
# In another window.
npm run start 
```

## Notes

>Tournament states:
```
pending
underway
awaiting review
complete
```

>DateTime format:

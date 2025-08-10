# SideQuest
> Micro adventure / things to do recommendations (location based)

## Project description
Basic recommendations for things to do - nearby, simple and not too time-consuming when you're bored or want something new/different to do. Has a filtering system to narrow down the suggestions, or a random feature if feeling adventurous. The focus is on solo suggestions for now, allowing to expand to small/big group suggestions later on. Mobile first!

## MVP
User inputs location and selects filters (or random) and gets a suggestion back on something to go do.

## Tech Stach
**Front End:** React, Vite, TypeScript (subject to change), Tailwind, Axios, plop + handlebars (automation)

**Back End:** Node.js, Express, MongoDB (mongoose), Typescript, JWT tokens or Lucia Auth

## Data sources
- Things to do: Google Places API + EventBrite API
- User location: Geolocation API
- Map: Leaflet.js


## Installation
- Fork the [SideQuest](https://github.com/luanadefourny/sidequest) repository

- Run `git clone` from your fork

- Install all the dependencies, seed the database and run the app

**Root directory**

```
npm install
```
**Server side**
```
cd server
npm install
```
**Seed the mock data** (from the server directory)

To populate the database with mock data for development, you will have to create a `.env` file (based on the `.env.example` file) as well as run some JS code before building the app.

1. Copy the `.env.example` file to `.env` (from the root directory)
```
cp .env.example .env
```
2. Populate the variables in `.env` with the necessary values

3. Run the seed file
```
cd server
node seed.js
```

**Run the server**
```
nodemon index.js
```
**Client side**
```
cd ../client
npm install
npm run dev
```

## Client automation
If you want to add components and/or services, feel free to use the scripts I have created. Running them allows the creation of Component and Service files. They are run straight from the client directory and will create the respective directories, js and css files where needed with a predesign template.
```
npx plop component componentName
```
```
npx plop service serviceName
```

## Documentation - Apiary


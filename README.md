# ☀️ Weather Picnic Planner

Hello and welcome to my implementation of teh Weather Picnic Planner code exercise!

I chose [React Router in Famework Mode](https://reactrouter.com/start/framework/installation) because it's
a full-stack TypeScript and React framework that I happen to already be familiar with.

The app is mostly running as an SPA to make it easier to work with `localStorage`.
There are some API style endpoints which are not totally necessary, but I wanted to demonstrate the flexibility of the caching system.

For forecast and history requests, the app will first check `localStorage`, and then request it from the server if there is no cache hit.
On the server, it will first check an in-memory cache and then finally call the OpenMeteo API if there's nothing in the cache.

To start it, run:

```
npm i
npm run dev
```

There are also a few tests for some of the utility functions. To run those:

```
npm run test
```

On first run (or after `localStorage` is cleared), it will present you with a form to
set up your preferences for the app. Once that has been stored, it will then take you to
the main page of the app.

## Features and Decisions

One of the more interesting parts of the application is the implementation of the caching feature.
The caching itself is simple - it uses string keys and a ttl to determine if there is useable data in the cache.

I designed it with composability in mind, so that we can wrap any function and provide any storage service
for it to use. This then allowed me to easily set up a `localStorage` cache for the client and
an in-memory cache for the server. For example:

```
// local storage cache, for clients
const getForecast = withCache(getForecastBase, {
  getKey: (args) => `forecast__${args.join("__")}`,
  ttlMinutes: 30,
  schema: z.array(forecastSchema),
  storage: localStorageService,
});

// in memory cache, for the server
const getForecast = withCache(getForecastBase, {
  getKey: (args) => `forecast__${args.join("__")}`,
  ttlMinutes: 30,
  schema: z.array(forecastSchema),
  storage: memoryStorageService,
});
```

If either of those storage services need to be changed, we could quickly add another by
creating a wrapper that matches the storage service interface.

We're also able to use a different weather API by creating a function for it and wrapping it with `withCache`.

This implementation allows for a very clean interface, with callers not needing to know much about it:

```
const forecast = await getForecast(settings.latitude, settings.longitude, tz);
```

# Original README

Welcome to the Weather Picnic Planner code exercise! Your goal is to create a robust, intuitive application that helps users choose the best day for a picnic based on weather forecasts and historical trends. You will use the [Open-Meteo API](https://open-meteo.com/) as your primary weather data source.

## 🎯 Main Features and Requirements

### 1. Interactive Two Week Forecast Calendar

**Description:**

- Display a calendar showing the next two weeks from today's date (inclusive of today).
- Dates should be color coded according to picnic suitability:
  - **Green:** Ideal picnic conditions (comfortable temperatures, low chance of rain).
  - **Yellow:** Fair conditions (moderate temperatures, slight chance of rain).
  - **Red:** Poor conditions (extreme temperatures, high chance of rain).

**Architecture Considerations:**

- Define clear criteria for "ideal," "fair," and "poor" conditions.
- Implement efficient data fetching and caching.

### 2. Detailed Weather View for Each Day

**Description:**

- Clicking a date on the calendar should display:
  - Forecasted temperature, precipitation, humidity, and wind details.
  - Historical weather statistics for that date from the past 10 years (average temperatures, precipitation patterns, etc.).

**Architecture Considerations:**

- Aggregate and clearly visualize historical data.
- Handle multiple concurrent data requests efficiently.

### 3. Local Storage and Data Caching

**Description:**

- Cache weather data locally to minimize unnecessary API calls and improve app performance.
- Clearly document caching strategy including refresh intervals and cache invalidation.

**Architecture Considerations:**

- Choose appropriate local storage (e.g., localStorage, IndexedDB, SQLite).
- Clearly document cache management strategies.

### 4. API Abstraction and Extensibility

**Description:**

- Implement a clear abstraction layer around the Open-Meteo API.
- Ensure your architecture allows easy substitution or addition of alternative weather data sources.

**Architecture Considerations:**

- Craft a clear interface design.

## 📌 Bonus Features (Optional Stretch Goals)

Consider implementing one or more of the following to showcase advanced architectural thinking:

- **Location Selection:** Allow users to dynamically select or update their picnic location.
- **User Preferences:** Enable users to customize weather criteria (e.g., temperature thresholds).

## 🔨 Technical Expectations

Clearly demonstrate the following in your submission:

- Separation of concerns and modular design
- Clear, maintainable, and well documented code
- Performance considerations and optimizations
- Handling of edge cases and errors
- Thoughtful user experience (while not looking for UI perfection, we do want an easily useable interface)

## 🛠 Deliverables

- Working source code in a publicly accessible repository
  - Fork this repo and submit a PR with from your repo to alert us that you are ready for us to review
- Instructions on how to run, build, and test the application
- Documentation (or README) explaining architecture decisions and trade-offs

## 🎖 Evaluation Criteria

Your submission will be evaluated based on:

- **Architecture Quality** (modularity, maintainability, scalability)
- **Code Clarity and Readability**
- **Implementation of Core Features**

---

Good luck, have fun, and happy coding! 🌤

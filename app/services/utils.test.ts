import { describe, it, assert } from "vitest";
import {
  getAverage,
  getConditions,
  getMax,
  getMin,
  isSameMonthAndDay,
} from "./utils";
import type { Forecast, WeatherHistory } from "~/types/forecast";
import type { Settings } from "~/types/settings";

describe("is same month and day", () => {
  it("compares the month and day but ignores the year", () => {
    assert(isSameMonthAndDay("2025-01-01", "2025-01-01"));
    assert(isSameMonthAndDay("2023-01-01", "2025-01-01"));
    assert(!isSameMonthAndDay("2025-01-01", "2025-01-02"));
    assert(!isSameMonthAndDay("2025-01-01", "2025-02-02"));
  });
});

describe("weather history utils", () => {
  const history: WeatherHistory[] = [
    {
      date: "2025-01-01",
      temperatureMax: 25,
      relativeHumidity: 0,
      windSpeedMax: 0,
    },
    {
      date: "2025-01-02",
      temperatureMax: 50,
      relativeHumidity: 0,
      windSpeedMax: 0,
    },
    {
      date: "2025-01-03",
      temperatureMax: 75,
      relativeHumidity: 0,
      windSpeedMax: 0,
    },
  ];

  describe("average value from list of history", () => {
    it("calculates the average", () => {
      const actual = getAverage(history, "temperatureMax");
      assert(actual === 50);
    });

    it("handles an empty list", () => {
      const actual = getAverage([], "temperatureMax");
      assert(actual === undefined);
    });
  });

  describe("day with maximum", () => {
    it("finds the day with the maximum value", () => {
      const actual = getMax(history, "temperatureMax");
      assert(actual === history[2]);
    });

    it("handles an empty list", () => {
      const actual = getMax([], "temperatureMax");
      assert(actual === undefined);
    });
  });

  describe("day with minimum", () => {
    it("finds the day with the minimum value", () => {
      const actual = getMin(history, "temperatureMax");
      assert(actual === history[0]);
    });

    it("handles an empty list", () => {
      const actual = getMin([], "temperatureMax");
      assert(actual === undefined);
    });
  });
});

describe("conditions", () => {
  const settings: Settings = {
    latitude: 0,
    longitude: 0,
    idealTempMin: 70,
    idealTempMax: 80,
    idealPrecipMax: 30,
    fairTempMin: 60,
    fairTempMax: 85,
    fairPrecipMax: 50,
  };

  it("temp ideal, precip ideal", () => {
    const forecast: Forecast = {
      date: "2025-01-01",
      temperatureMax: 72,
      precipProbability: 10,
      relativeHumidity: 10,
      windSpeedMax: 2,
    };

    const actual = getConditions(forecast, settings);
    assert(actual === "ideal");
  });

  it("temp ideal, precip fair", () => {
    const forecast: Forecast = {
      date: "2025-01-01",
      temperatureMax: 72,
      precipProbability: 40,
      relativeHumidity: 10,
      windSpeedMax: 2,
    };

    const actual = getConditions(forecast, settings);
    assert(actual === "fair");
  });

  it("temp ideal, precip poor", () => {
    const forecast: Forecast = {
      date: "2025-01-01",
      temperatureMax: 72,
      precipProbability: 90,
      relativeHumidity: 10,
      windSpeedMax: 2,
    };

    const actual = getConditions(forecast, settings);
    assert(actual === "poor");
  });

  it("temp fair, precip ideal", () => {
    const forecast: Forecast = {
      date: "2025-01-01",
      temperatureMax: 65,
      precipProbability: 0,
      relativeHumidity: 10,
      windSpeedMax: 2,
    };

    const actual = getConditions(forecast, settings);
    assert(actual === "fair");
  });

  it("temp poor, precip ideal", () => {
    const forecast: Forecast = {
      date: "2025-01-01",
      temperatureMax: -65,
      precipProbability: 0,
      relativeHumidity: 10,
      windSpeedMax: 2,
    };

    const actual = getConditions(forecast, settings);
    assert(actual === "poor");
  });

  it("temp fair, precip fair", () => {
    const forecast: Forecast = {
      date: "2025-01-01",
      temperatureMax: 65,
      precipProbability: 35,
      relativeHumidity: 10,
      windSpeedMax: 2,
    };

    const actual = getConditions(forecast, settings);
    assert(actual === "fair");
  });

  it("temp poor, precip poor", () => {
    const forecast: Forecast = {
      date: "2025-01-01",
      temperatureMax: -65,
      precipProbability: 85,
      relativeHumidity: 10,
      windSpeedMax: 2,
    };

    const actual = getConditions(forecast, settings);
    assert(actual === "poor");
  });
});

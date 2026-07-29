import ec01 from "@/assets/ec-01-insights-v2.jpg.asset.json";
import ec02 from "@/assets/ec-02-intake.jpg.asset.json";
import ec03 from "@/assets/ec-03-concepts.jpg.asset.json";
import ec04 from "@/assets/ec-04-budget.jpg.asset.json";
import ec05 from "@/assets/ec-05-shopping.jpg.asset.json";
import ec06 from "@/assets/ec-06-forecast.jpg.asset.json";
import ec07 from "@/assets/ec-07-events.jpg.asset.json";
import ncr01 from "@/assets/ncr-01-my-records.jpg.asset.json";
import ncr02 from "@/assets/ncr-02-all-records.jpg.asset.json";
import ncrForm from "@/assets/ncr-01-form.jpg.asset.json";
import pa01 from "@/assets/pa-01-pantry.jpg.asset.json";
import pa02 from "@/assets/pa-02-recipe-generator.jpg.asset.json";
import pa03 from "@/assets/pa-03-meal-planner.jpg.asset.json";
import pa04 from "@/assets/pa-04-feed.jpg.asset.json";
import pa05 from "@/assets/pa-05-login.jpg.asset.json";
import pa06 from "@/assets/pa-06-welcome.jpg.asset.json";

export const shotImages: Record<string, string> = {
  "ec-01-insights.jpg": ec01.url,
  "ec-02-intake.jpg": ec02.url,
  "ec-03-concepts.jpg": ec03.url,
  "ec-04-budget.jpg": ec04.url,
  "ec-05-shopping.jpg": ec05.url,
  "ec-06-forecast.jpg": ec06.url,
  "ec-07-events.jpg": ec07.url,
  "chatbot.png": "/chatbot.png",
  "login.png": "/login.png",
  "ncr-01-form.jpg": ncrForm.url,
  "ncr-02-my-records.jpg": ncr01.url,
  "ncr-03-all-records.jpg": ncr02.url,
  "pa-01-pantry.jpg": pa01.url,
  "pa-02-recipe-generator.jpg": pa02.url,
  "pa-03-meal-planner.jpg": pa04.url,
  "pa-04-feed.jpg": pa03.url,
  "pa-05-login.jpg": pa05.url,
  "pa-06-welcome.jpg": pa06.url,
};

export const shotDims: Record<string, { w: number; h: number }> = {
  "ec-01-insights.jpg": { w: 1920, h: 1224 },
  "ec-02-intake.jpg": { w: 1542, h: 1064 },
  "ec-03-concepts.jpg": { w: 1542, h: 1064 },
  "ec-04-budget.jpg": { w: 1542, h: 1064 },
  "ec-05-shopping.jpg": { w: 1542, h: 1064 },
  "ec-06-forecast.jpg": { w: 1542, h: 1064 },
  "ec-07-events.jpg": { w: 1542, h: 1064 },
  "chatbot.png": { w: 3420, h: 1892 },
  "login.png": { w: 3418, h: 1892 },
  "ncr-01-form.jpg": { w: 720, h: 1280 },
  "ncr-02-my-records.jpg": { w: 940, h: 1600 },
  "ncr-03-all-records.jpg": { w: 956, h: 1600 },
  "pa-01-pantry.jpg": { w: 1548, h: 862 },
  "pa-02-recipe-generator.jpg": { w: 1304, h: 818 },
  "pa-03-meal-planner.jpg": { w: 1240, h: 708 },
  "pa-04-feed.jpg": { w: 1520, h: 870 },
  "pa-05-login.jpg": { w: 1800, h: 998 },
  "pa-06-welcome.jpg": { w: 1800, h: 997 },
};

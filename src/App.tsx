import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type SeasonType = "summer" | "winter" | "spring" | "fall" | "allYear";

interface SeasonalData {
  peak: number[];
  shoulder: number[];
  low: number[];
}

type SeasonalDemand = {
  [key in SeasonType]: SeasonalData;
}

interface DataPoint {
  price: number;
  saleProb: number;
  expectedValue: number;
}

const VintedCalculator = () => {
  // Basic settings
  const [maxStorage, setMaxStorage] = useState(50);
  const [currentStorage, setCurrentStorage] = useState(30);
  const [listedPrice, setListedPrice] = useState(40);
  const [daysListed, setDaysListed] = useState(7);
  const [receivedOffer, setReceivedOffer] = useState(30);
  const [itemType, setItemType] = useState<SeasonType>("summer");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentMonth] = useState(new Date().getMonth() + 1);

  // Advanced settings
  const [peakSeasonMultiplier, setPeakSeasonMultiplier] = useState(1.3);
  const [offSeasonMultiplier, setOffSeasonMultiplier] = useState(0.7);
  const [highStoragePressureThreshold, setHighStoragePressureThreshold] =
    useState(80);
  const [mediumStoragePressureThreshold, setMediumStoragePressureThreshold] =
    useState(60);
  const [daysListedThreshold, setDaysListedThreshold] = useState(30);

  // Rest of the existing code remains the same until getSeasonalMultiplier
  // Seasonal demand multipliers
  const seasonalDemand: SeasonalDemand = {
    summer: {
      peak: [6, 7, 8], // June, July, August
      shoulder: [4, 5, 9], // April, May, September
      low: [1, 2, 3, 10, 11, 12], // Rest of the year
    },
    winter: {
      peak: [11, 12, 1], // November, December, January
      shoulder: [2, 3, 10], // February, March, October
      low: [4, 5, 6, 7, 8, 9], // Rest of the year
    },
    spring: {
      peak: [3, 4, 5], // March, April, May
      shoulder: [2, 6, 9], // February, June, September
      low: [1, 7, 8, 10, 11, 12], // Rest of the year
    },
    fall: {
      peak: [9, 10, 11], // September, October, November
      shoulder: [8, 12, 1], // August, December, January
      low: [2, 3, 4, 5, 6, 7], // Rest of the year
    },
    allYear: {
      peak: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // All months
      shoulder: [],
      low: [],
    },
  };
  const getSeasonalMultiplier = (): number => {
    const seasons = seasonalDemand[itemType];
    if (seasons.peak.includes(currentMonth)) return peakSeasonMultiplier;
    if (seasons.shoulder.includes(currentMonth)) return 1.0;
    return offSeasonMultiplier;
  };

  const getSeasonalAdvice = () => {
    const multiplier = getSeasonalMultiplier();
    if (multiplier > 1) {
      return "Peak season - can be firm on price";
    } else if (multiplier === 1) {
      return "Average demand - standard pricing";
    } else {
      return "Off-season - consider storage vs. discount tradeoff";
    }
  };

  // Modify storagePressure calculations
  const storagePressure = (currentStorage / maxStorage) * 100;
  const storageUrgency =
    storagePressure > highStoragePressureThreshold
      ? "High"
      : storagePressure > mediumStoragePressureThreshold
      ? "Medium"
      : "Low";

  // Modify getCounterOffer to use new thresholds
  const getCounterOffer = () => {
    if (shouldAcceptOffer) return "Accept the offer";

    const targetPrice = optimalPrice.price;
    const counterOffer = Math.round((targetPrice + receivedOffer) / 2);

    if (storagePressure > highStoragePressureThreshold) {
      return `Counter with ${counterOffer}€ (due to high storage pressure)`;
    } else if (daysListed > daysListedThreshold) {
      return `Counter with ${counterOffer}€ (due to long listing time)`;
    } else if (getSeasonalMultiplier() < 1) {
      return `Consider ${counterOffer}€ (off-season pricing)`;
    } else {
      return `Counter with ${targetPrice}€ (favorable season)`;
    }
  };

  // Add this probability data generation function
  const generateProbabilityData = (originalPrice: number) => {
    const data: DataPoint[] = [];
    const minPrice = originalPrice * 0.4;
    const seasonalMultiplier = getSeasonalMultiplier();

    for (
      let price = originalPrice;
      price >= minPrice;
      price -= originalPrice * 0.05
    ) {
      // Base probability increases as price decreases and time passes
      const baseProbability = (1 - price / originalPrice) * 100;
      const timeBoost = Math.min(daysListed / 30, 1) * 20;

      // Apply seasonal multiplier to probability
      let probability = (baseProbability + timeBoost) * seasonalMultiplier;
      probability = Math.min(probability, 95); // Cap at 95%

      const expectedValue = price * (probability / 100);

      data.push({
        price: Math.round(price),
        saleProb: Math.round(probability),
        expectedValue: Math.round(expectedValue),
      });
    }
    return data;
  };

  // Add these calculations
  const data = generateProbabilityData(listedPrice);
  const optimalPrice = data.reduce(
    (max, point) => (point.expectedValue > max.expectedValue ? point : max),
    data[0]
  );
  const offerAnalysis =
    data.find((point) => point.price <= receivedOffer) || data[data.length - 1];
  const shouldAcceptOffer =
    offerAnalysis.expectedValue >= optimalPrice.expectedValue * 0.9;

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Vinted Pricing & Offer Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Maximum Storage Capacity
              <input
                type="number"
                value={maxStorage}
                onChange={(e) => setMaxStorage(Number(e.target.value))}
                className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                min="1"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Current Storage (Items)
              <input
                type="number"
                value={currentStorage}
                onChange={(e) => setCurrentStorage(Number(e.target.value))}
                className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                min="0"
                max={maxStorage}
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Item Type
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as SeasonType)}
                className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
              >
                <option value="summer">Summer Clothing</option>
                <option value="winter">Winter Clothing</option>
                <option value="spring">Spring Clothing</option>
                <option value="fall">Fall Clothing</option>
                <option value="allYear">All-Season Item</option>
              </select>
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Listed Price (€)
              <input
                type="number"
                value={listedPrice}
                onChange={(e) => setListedPrice(Number(e.target.value))}
                className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                min="1"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Days Listed
              <input
                type="number"
                value={daysListed}
                onChange={(e) => setDaysListed(Number(e.target.value))}
                className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                min="0"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Received Offer (€)
              <input
                type="number"
                value={receivedOffer}
                onChange={(e) => setReceivedOffer(Number(e.target.value))}
                className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                min="0"
              />
            </label>
          </div>
        </div>
        <div className="mt-4 p-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
          >
            {showAdvanced
              ? "▼ Hide Advanced Settings"
              : "▶ Show Advanced Settings"}
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-semibold mb-4">Advanced Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Peak Season Multiplier
                    <input
                      type="number"
                      value={peakSeasonMultiplier}
                      onChange={(e) =>
                        setPeakSeasonMultiplier(Number(e.target.value))
                      }
                      className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                      min="1"
                      max="2"
                      step="0.1"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Off-Season Multiplier
                    <input
                      type="number"
                      value={offSeasonMultiplier}
                      onChange={(e) =>
                        setOffSeasonMultiplier(Number(e.target.value))
                      }
                      className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                      min="0.1"
                      max="1"
                      step="0.1"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    High Storage Pressure Threshold (%)
                    <input
                      type="number"
                      value={highStoragePressureThreshold}
                      onChange={(e) =>
                        setHighStoragePressureThreshold(Number(e.target.value))
                      }
                      className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                      min="0"
                      max="100"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Medium Storage Pressure Threshold (%)
                    <input
                      type="number"
                      value={mediumStoragePressureThreshold}
                      onChange={(e) =>
                        setMediumStoragePressureThreshold(
                          Number(e.target.value)
                        )
                      }
                      className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                      min="0"
                      max="100"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Days Listed Threshold
                    <input
                      type="number"
                      value={daysListedThreshold}
                      onChange={(e) =>
                        setDaysListedThreshold(Number(e.target.value))
                      }
                      className="mt-1 block w-full rounded border border-gray-300 p-2 bg-white text-black"
                      min="1"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Chart Section */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="price"
                label={{ value: "Price (€)", position: "bottom" }}
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Sale Probability (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Expected Value (€)",
                  angle: 90,
                  position: "insideRight",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: "20px" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="saleProb"
                stroke="#8884d8"
                name="Sale Probability"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="expectedValue"
                stroke="#ff7300"
                name="Expected Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Analysis Section */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-bold mb-2">Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Storage Status</h4>
              <ul className="list-disc ml-5">
                <li>
                  Current Storage: {currentStorage}/{maxStorage} items
                </li>
                <li>Storage Pressure: {storageUrgency}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Seasonal Analysis</h4>
              <ul className="list-disc ml-5">
                <li>
                  Current Month:{" "}
                  {new Date().toLocaleString("default", { month: "long" })}
                </li>
                <li>{getSeasonalAdvice()}</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Price Analysis</h4>
            <ul className="list-disc ml-5">
              <li>Optimal Price: €{optimalPrice.price}</li>
              <li>Sale Probability: {optimalPrice.saleProb}%</li>
              <li>{getCounterOffer()}</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-bold mb-3">How the Algorithm Works</h3>
          <div className="space-y-3 text-sm">
            <p>
              <strong>1. Base Probability Calculation:</strong> The algorithm
              starts with a base probability of sale that increases as the price
              decreases. This follows a modified inverse relationship between
              price and probability.
            </p>
            <p>
              <strong>2. Time Adjustment:</strong> Items listed for longer
              periods receive a probability boost, maxing out at{" "}
              {daysListedThreshold} days. This reflects the reality that some
              items may need price adjustments if they don&apos;t sell within a
              reasonable timeframe.
            </p>
            <p>
              <strong>3. Seasonal Multiplier:</strong> The algorithm applies a
              seasonal multiplier based on the item type and current month: -
              Peak season: {Math.round((peakSeasonMultiplier - 1) * 100)}%
              increase in sale probability - Shoulder season: No adjustment -
              Off season: {Math.round((1 - offSeasonMultiplier) * 100)}%
              decrease in sale probability
            </p>
            <p>
              <strong>4. Storage Pressure:</strong> The algorithm considers your
              current storage utilization: - High pressure ({">"}
              {highStoragePressureThreshold}%): Suggests more aggressive pricing
              - Medium pressure ({">"}
              {mediumStoragePressureThreshold}%): Balanced approach - Low
              pressure: Can be more patient for better prices
            </p>
            <p>
              <strong>5. Expected Value Calculation:</strong> For each potential
              price point, the algorithm calculates an expected value by
              multiplying the price by the probability of sale. This helps find
              the optimal balance between price and likelihood of sale.
            </p>
            <p>
              <strong>6. Offer Evaluation:</strong> When evaluating offers, the
              algorithm compares the expected value of the offer against the
              optimal price point, while considering storage pressure and
              seasonality to make recommendations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VintedCalculator;

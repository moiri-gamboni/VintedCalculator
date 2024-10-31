# Vinted Pricing Calculator

A smart calculator to help Vinted sellers optimize their pricing strategy based on storage capacity, seasonality, and market dynamics.

## Features

- **Dynamic Pricing Analysis**: Calculates optimal price points based on probability of sale and expected value
- **Seasonal Adjustments**: Automatically adjusts pricing recommendations based on item type and current season
- **Storage Management**: Factors in your storage capacity to help balance inventory turnover
- **Visual Analytics**: 
  - Real-time probability curves
  - Sale probability vs. expected value visualization
  - Storage pressure indicators
- **Offer Evaluation**: Helps decide whether to accept, counter, or hold firm on received offers

## Live Demo

Try it out: [Vinted Pricing Calculator](https://moiri-gamboni.github.io/vinted-calculator/)

## Usage

1. Enter your storage capacity and current inventory
2. Select the type of item you're selling (summer, winter, spring, fall, or all-season)
3. Input the listed price and days listed
4. If you receive an offer, enter it to get a recommendation
5. Use the advanced settings to fine-tune seasonal multipliers and thresholds

## Advanced Settings

- Peak/Off-season multipliers: Adjust how much seasonality affects pricing
- Storage pressure thresholds: Configure when to start reducing prices due to storage constraints
- Days listed thresholds: Set the point at which items are considered slow-moving

## How It Works

The calculator uses several factors to optimize pricing:

1. **Base Probability Calculation**: Starts with a base probability of sale that increases as price decreases, following a modified inverse relationship.

2. **Time Adjustment**: Items listed for longer periods receive a probability boost, reflecting the reality that some items may need price adjustments if they don't sell quickly.

3. **Seasonal Multiplier**: Applies a seasonal modifier based on item type and current month:
   - Peak season: Increased sale probability
   - Shoulder season: Normal probability
   - Off season: Decreased probability

4. **Storage Pressure**: Considers your current storage utilization:
   - High pressure: Suggests more aggressive pricing
   - Medium pressure: Balanced approach
   - Low pressure: Can be more patient for better prices

5. **Expected Value**: For each potential price point, calculates an expected value (price × probability) to find the optimal balance.

## Technical Details

Built with:
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts for data visualization

## Local Development

```bash
# Clone the repository
git clone https://github.com/moiri-gamboni/vinted-calculator.git

# Install dependencies
cd vinted-calculator
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
vinted-calculator/
├── src/
│   ├── App.tsx        # Main calculator component
│   ├── components/    # UI components from shadcn
│   └── lib/          # Utility functions
├── public/           # Static assets
└── dist/            # Built files (generated)
```

## Contributing

Contributions are welcome! Here are some ways you can contribute:

1. **Bug Reports**: Open an issue if you find a bug
2. **Feature Requests**: Have an idea? Share it in the issues
3. **Code Contributions**: 
   - Fork the repository
   - Create a feature branch
   - Submit a pull request

Please make sure to update tests as appropriate and follow the existing code style.

## License

MIT

## Author

Moïri Gamboni

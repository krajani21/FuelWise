import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingDown, MapPin, DollarSign, Fuel, Clock, Target, Award, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            How FuelWise Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart fuel savings through intelligent cost analysis. Save money on every fill-up by understanding the true cost of convenience.
          </p>
        </div>

        {/* The Problem Section */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-red-900 mb-3 flex items-center">
            <Target className="h-6 w-6 mr-2" />
            The Problem: Distance Isn't Everything
          </h2>
          <p className="text-red-800 mb-3">
            Most people choose the nearest gas station to save time. But the <strong>nearest station isn't always the cheapest option</strong> when you factor in total costs.
          </p>
          <p className="text-red-700">
            Driving 5 more minutes to a station with lower prices can save you <strong>$3-5 per fill-up</strong>. That's <strong>$150-250 per year</strong> for the average driver who fills up weekly!
          </p>
        </div>

        {/* The Solution Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#003366] mb-6 flex items-center">
            <Fuel className="h-8 w-8 mr-3 text-[#4CAF50]" />
            The FuelWise Solution
          </h2>
          
          <p className="text-lg text-gray-700 mb-6">
            FuelWise calculates the <strong>true cost</strong> of fueling at each station by accounting for both the fuel price and the cost to drive there. We show you where you'll get the <strong>maximum fuel for your budget</strong> after all expenses.
          </p>

          {/* How It Works Steps */}
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-[#4CAF50] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#333333] mb-2">Enter Your Information</h3>
                <p className="text-gray-600">
                  Tell us your budget (e.g., $40), your vehicle's fuel efficiency (e.g., 8.5 L/100km), and your preferred search radius.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-[#4CAF50] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#333333] mb-2">We Find Nearby Stations</h3>
                <p className="text-gray-600">
                  Using Google Maps, we locate all gas stations within your specified radius and get real-time fuel prices.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-[#4CAF50] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#333333] mb-2">Calculate True Costs</h3>
                <p className="text-gray-600">
                  For each station, we calculate the <strong>round-trip travel cost</strong> and subtract it from your budget to determine how much fuel you can actually afford.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-[#4CAF50] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#333333] mb-2">Show You the Best Deals</h3>
                <p className="text-gray-600">
                  We rank stations by <strong>net savings</strong> - showing you where you'll get the most fuel after accounting for travel expenses. Stations with positive net benefits are worth the extra drive!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Math Behind It */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#003366] mb-6 flex items-center">
            <Calculator className="h-8 w-8 mr-3 text-blue-600" />
            The Math Behind the Savings
          </h2>
          
          <p className="text-lg text-gray-700 mb-6">
            Here's exactly how we calculate which stations offer the best value:
          </p>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">Step 1: Calculate Travel Cost</h3>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm mb-3">
              Travel Cost = (Distance × 2 × Fuel Efficiency / 100) × Price per Litre
            </div>
            <p className="text-gray-600 text-sm">
              <strong>Example:</strong> Station is 10km away, efficiency is 8.5 L/100km, price is $1.50/L<br />
              Travel Cost = (10 × 2 × 8.5 / 100) × $1.50 = <strong>$2.55</strong>
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">Step 2: Calculate Effective Fuel Volume</h3>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm mb-3">
              Effective Budget = Your Budget - Travel Cost<br />
              Fuel Volume = Effective Budget / Price per Litre
            </div>
            <p className="text-gray-600 text-sm">
              <strong>Example:</strong> Budget is $40, travel cost is $2.55, price is $1.50/L<br />
              Effective Budget = $40 - $2.55 = $37.45<br />
              Fuel Volume = $37.45 / $1.50 = <strong>24.97 litres</strong>
            </p>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">Step 3: Compare to Nearest Station</h3>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm mb-3">
              Net Savings = (Fuel at Station - Fuel at Nearest) × Nearest Station Price
            </div>
            <p className="text-gray-600 text-sm">
              <strong>Example:</strong> You get 24.97L at the farther station vs. 23.8L at nearest ($1.60/L)<br />
              Net Savings = (24.97 - 23.8) × $1.60 = <strong>+$1.87 savings</strong>
            </p>
            <p className="text-green-700 font-semibold mt-3">
              ✓ Worth the extra drive! You get 1.17 more litres of fuel even after paying for the trip.
            </p>
          </div>
        </div>

        {/* Real-World Example */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#003366] mb-6 flex items-center">
            <TrendingDown className="h-8 w-8 mr-3 text-[#4CAF50]" />
            Real-World Example
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Scenario</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Budget: $50</li>
                <li>• Vehicle efficiency: 9.0 L/100km</li>
                <li>• Searching within 20km radius</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-red-900">Nearest Station</h4>
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700"><strong>Distance:</strong> 2 km away</p>
                  <p className="text-gray-700"><strong>Price:</strong> $1.65/L</p>
                  <p className="text-gray-700"><strong>Travel cost:</strong> $0.59</p>
                  <p className="text-gray-700"><strong>Fuel you get:</strong> 29.95 litres</p>
                  <p className="text-red-700 font-bold mt-3">Total value: ~$49.41</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-green-900">Better Station (8km away)</h4>
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700"><strong>Distance:</strong> 8 km away</p>
                  <p className="text-gray-700"><strong>Price:</strong> $1.49/L</p>
                  <p className="text-gray-700"><strong>Travel cost:</strong> $2.15</p>
                  <p className="text-gray-700"><strong>Fuel you get:</strong> 32.11 litres</p>
                  <p className="text-green-700 font-bold mt-3">Total value: ~$52.96</p>
                </div>
              </div>
            </div>

            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-900 font-semibold text-lg mb-2">
                <DollarSign className="inline h-5 w-5 mr-1" />
                Net Benefit: +$3.55
              </p>
              <p className="text-green-800">
                By driving 6 km farther (about 6-7 minutes), you get <strong>2.16 more litres</strong> of fuel. 
                That's worth <strong>$3.55 in savings</strong> - even after paying for the extra drive!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Long-Term Impact
              </h4>
              <div className="space-y-2 text-gray-700">
                <p>If you fill up once per week:</p>
                <p className="ml-4">• <strong>Per month:</strong> $3.55 × 4 = <span className="text-green-600 font-bold">$14.20 saved</span></p>
                <p className="ml-4">• <strong>Per year:</strong> $3.55 × 52 = <span className="text-green-600 font-bold text-lg">$184.60 saved</span></p>
                <p className="mt-4 text-blue-900 font-semibold">
                  That's enough for 3-4 free tanks of gas just by making smarter choices!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtering Options */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Sorting Options Explained
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-[#4CAF50] pl-4">
              <h3 className="text-xl font-semibold text-[#333333] mb-2">
                <Award className="inline h-5 w-5 mr-2 text-[#4CAF50]" />
                Sort by Net Savings (Recommended)
              </h3>
              <p className="text-gray-700">
                Shows stations ranked by <strong>true financial benefit</strong>. Positive numbers mean you get more fuel even after travel costs. 
                This is the smartest way to save money - stations at the top offer genuine savings worth the extra drive.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-[#333333] mb-2">
                <Fuel className="inline h-5 w-5 mr-2 text-blue-600" />
                Sort by Max Volume
              </h3>
              <p className="text-gray-700">
                Shows which stations let you buy the most fuel for your budget (after travel costs). 
                Great when you want to maximize your tank level rather than optimize savings.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-xl font-semibold text-[#333333] mb-2">
                <MapPin className="inline h-5 w-5 mr-2 text-purple-600" />
                Sort by Distance
              </h3>
              <p className="text-gray-700">
                Shows nearest stations first. Use this when time is critical, but remember - the closest isn't always the best value!
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Why FuelWise is Different
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow">
              <h3 className="font-bold text-[#333333] mb-2 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-[#4CAF50]" />
                True Cost Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                We're the only app that accounts for round-trip travel costs in fuel calculations, giving you accurate net savings.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow">
              <h3 className="font-bold text-[#333333] mb-2 flex items-center">
                <Target className="h-5 w-5 mr-2 text-[#4CAF50]" />
                Real-Time Prices
              </h3>
              <p className="text-gray-600 text-sm">
                Live fuel prices from Google Maps ensure you always have the most up-to-date information.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow">
              <h3 className="font-bold text-[#333333] mb-2 flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-[#4CAF50]" />
                Personalized Results
              </h3>
              <p className="text-gray-600 text-sm">
                Results tailored to your vehicle's efficiency, preferred brands, and fuel type (Regular, Premium, Diesel).
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 shadow">
              <h3 className="font-bold text-[#333333] mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#4CAF50]" />
                Flexible Search Radius
              </h3>
              <p className="text-gray-600 text-sm">
                Search from 5km to 50km. The app suggests expanding your search when better deals exist farther away.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-[#003366] text-white rounded-xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of smart drivers who are saving hundreds of dollars per year on fuel costs.
          </p>
          <Link 
            to="/search"
            className="inline-flex items-center bg-[#4CAF50] hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            Find Best Fuel Prices Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;


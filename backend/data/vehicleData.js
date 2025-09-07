// Comprehensive vehicle database with makes, models, and year ranges
const vehicleDatabase = {
  "Toyota": {
    models: {
      "Camry": { 
        startYear: 1982, 
        endYear: 2024,
        tankCapacity: {
          "2018-2024": 60.6,
          "2012-2017": 64.3,
          "2007-2011": 70.0,
          "default": 65.0
        }
      },
      "Corolla": { 
        startYear: 1966, 
        endYear: 2024,
        tankCapacity: {
          "2014-2024": 50.0,
          "2009-2013": 50.0,
          "2003-2008": 55.0,
          "default": 50.0
        }
      },
      "RAV4": { 
        startYear: 1994, 
        endYear: 2024,
        tankCapacity: {
          "2019-2024": 55.7,
          "2013-2018": 60.6,
          "2006-2012": 60.0,
          "default": 58.0
        }
      },
      "Highlander": { 
        startYear: 2000, 
        endYear: 2024,
        tankCapacity: {
          "2020-2024": 84.4,
          "2014-2019": 74.0,
          "2008-2013": 75.7,
          "default": 78.0
        }
      },
      "Prius": { 
        startYear: 1997, 
        endYear: 2024,
        tankCapacity: {
          "2016-2024": 43.0,
          "2010-2015": 45.0,
          "2004-2009": 45.0,
          "default": 44.0
        }
      },
      "Sienna": { 
        startYear: 1997, 
        endYear: 2024,
        tankCapacity: {
          "2021-2024": 71.9,
          "2011-2020": 75.7,
          "2004-2010": 79.5,
          "default": 76.0
        }
      },
      "Tacoma": { 
        startYear: 1995, 
        endYear: 2024,
        tankCapacity: {
          "2016-2024": 75.7,
          "2005-2015": 75.7,
          "1995-2004": 68.0,
          "default": 73.0
        }
      },
      "Tundra": { 
        startYear: 1999, 
        endYear: 2024,
        tankCapacity: {
          "2022-2024": 93.1,
          "2014-2021": 132.5,
          "2007-2013": 127.4,
          "default": 117.0
        }
      },
      "4Runner": { 
        startYear: 1984, 
        endYear: 2024,
        tankCapacity: {
          "2010-2024": 87.1,
          "2003-2009": 87.1,
          "1990-2002": 75.7,
          "default": 83.0
        }
      },
      "Avalon": { 
        startYear: 1994, 
        endYear: 2022,
        tankCapacity: {
          "2019-2022": 64.3,
          "2013-2018": 64.3,
          "2005-2012": 70.0,
          "default": 66.0
        }
      },
      "Yaris": { 
        startYear: 1999, 
        endYear: 2020,
        tankCapacity: {
          "2012-2020": 42.4,
          "2007-2011": 42.4,
          "1999-2006": 40.0,
          "default": 42.0
        }
      },
      "Venza": { 
        startYear: 2008, 
        endYear: 2024,
        tankCapacity: {
          "2021-2024": 64.3,
          "2009-2015": 75.7,
          "default": 70.0
        }
      },
      "Sequoia": { 
        startYear: 2000, 
        endYear: 2024,
        tankCapacity: {
          "2023-2024": 94.6,
          "2008-2022": 132.5,
          "2001-2007": 132.5,
          "default": 120.0
        }
      },
      "Land Cruiser": { 
        startYear: 1951, 
        endYear: 2021,
        tankCapacity: {
          "2008-2021": 93.1,
          "1998-2007": 96.2,
          "1990-1997": 87.1,
          "default": 92.0
        }
      }
    }
  },
  "Honda": {
    models: {
      "Civic": { 
        startYear: 1972, 
        endYear: 2024,
        tankCapacity: {
          "2016-2024": 47.3,
          "2012-2015": 50.0,
          "2006-2011": 50.0,
          "2001-2005": 50.0,
          "default": 48.0
        }
      },
      "Accord": { 
        startYear: 1976, 
        endYear: 2024,
        tankCapacity: {
          "2018-2024": 56.8,
          "2013-2017": 60.6,
          "2008-2012": 65.0,
          "2003-2007": 70.0,
          "default": 63.0
        }
      },
      "CR-V": { 
        startYear: 1995, 
        endYear: 2024,
        tankCapacity: {
          "2017-2024": 53.0,
          "2012-2016": 56.8,
          "2007-2011": 58.0,
          "2002-2006": 58.0,
          "default": 56.0
        }
      },
      "Pilot": { 
        startYear: 2002, 
        endYear: 2024,
        tankCapacity: {
          "2016-2024": 72.7,
          "2012-2015": 74.8,
          "2009-2011": 79.5,
          "2003-2008": 79.5,
          "default": 76.5
        }
      },
      "Odyssey": { 
        startYear: 1994, 
        endYear: 2024,
        tankCapacity: {
          "2018-2024": 74.8,
          "2011-2017": 75.7,
          "2005-2010": 79.5,
          "1999-2004": 75.0,
          "default": 76.0
        }
      },
      "Fit": { 
        startYear: 2006, 
        endYear: 2020,
        tankCapacity: {
          "2015-2020": 41.6,
          "2009-2014": 40.0,
          "2007-2008": 40.0,
          "default": 40.5
        }
      },
      "HR-V": { 
        startYear: 2015, 
        endYear: 2024,
        tankCapacity: {
          "2023-2024": 48.5,
          "2016-2022": 50.0,
          "default": 49.0
        }
      },
      "Passport": { 
        startYear: 1993, 
        endYear: 2024,
        tankCapacity: {
          "2019-2024": 72.7,
          "1994-2002": 75.0,
          "default": 74.0
        }
      },
      "Ridgeline": { 
        startYear: 2005, 
        endYear: 2024,
        tankCapacity: {
          "2017-2024": 75.7,
          "2006-2014": 83.3,
          "default": 79.5
        }
      },
      "Insight": { 
        startYear: 1999, 
        endYear: 2022,
        tankCapacity: {
          "2019-2022": 40.6,
          "2010-2014": 40.6,
          "2000-2006": 38.0,
          "default": 39.7
        }
      },
      "Element": { 
        startYear: 2003, 
        endYear: 2011,
        tankCapacity: {
          "2003-2011": 64.0,
          "default": 64.0
        }
      },
      "S2000": { 
        startYear: 1999, 
        endYear: 2009,
        tankCapacity: {
          "1999-2009": 50.0,
          "default": 50.0
        }
      }
    }
  },
  "Ford": {
    models: {
      "F-150": { startYear: 1975, endYear: 2024 },
      "Escape": { startYear: 2000, endYear: 2024 },
      "Explorer": { startYear: 1990, endYear: 2024 },
      "Focus": { startYear: 1998, endYear: 2018 },
      "Fusion": { startYear: 2005, endYear: 2020 },
      "Mustang": { startYear: 1964, endYear: 2024 },
      "Edge": { startYear: 2006, endYear: 2024 },
      "Expedition": { startYear: 1996, endYear: 2024 },
      "Transit": { startYear: 2014, endYear: 2024 },
      "Ranger": { startYear: 1982, endYear: 2024 },
      "Bronco": { startYear: 1965, endYear: 2024 },
      "EcoSport": { startYear: 2017, endYear: 2022 },
      "Fiesta": { startYear: 1976, endYear: 2019 }
    }
  },
  "Chevrolet": {
    models: {
      "Silverado": { startYear: 1999, endYear: 2024 },
      "Equinox": { startYear: 2004, endYear: 2024 },
      "Tahoe": { startYear: 1995, endYear: 2024 },
      "Malibu": { startYear: 1964, endYear: 2024 },
      "Traverse": { startYear: 2008, endYear: 2024 },
      "Suburban": { startYear: 1935, endYear: 2024 },
      "Colorado": { startYear: 2004, endYear: 2024 },
      "Camaro": { startYear: 1966, endYear: 2024 },
      "Corvette": { startYear: 1953, endYear: 2024 },
      "Cruze": { startYear: 2008, endYear: 2019 },
      "Impala": { startYear: 1958, endYear: 2020 },
      "Trax": { startYear: 2012, endYear: 2024 },
      "Blazer": { startYear: 1969, endYear: 2024 }
    }
  },
  "BMW": {
    models: {
      "3 Series": { startYear: 1975, endYear: 2024 },
      "5 Series": { startYear: 1972, endYear: 2024 },
      "7 Series": { startYear: 1977, endYear: 2024 },
      "X3": { startYear: 2003, endYear: 2024 },
      "X5": { startYear: 1999, endYear: 2024 },
      "X1": { startYear: 2009, endYear: 2024 },
      "X7": { startYear: 2018, endYear: 2024 },
      "4 Series": { startYear: 2013, endYear: 2024 },
      "6 Series": { startYear: 1976, endYear: 2024 },
      "8 Series": { startYear: 1989, endYear: 2024 },
      "Z4": { startYear: 2002, endYear: 2024 },
      "i3": { startYear: 2013, endYear: 2022 },
      "i4": { startYear: 2021, endYear: 2024 }
    }
  },
  "Mercedes-Benz": {
    models: {
      "C-Class": { startYear: 1993, endYear: 2024 },
      "E-Class": { startYear: 1985, endYear: 2024 },
      "S-Class": { startYear: 1972, endYear: 2024 },
      "GLC": { startYear: 2015, endYear: 2024 },
      "GLE": { startYear: 1997, endYear: 2024 },
      "GLA": { startYear: 2013, endYear: 2024 },
      "GLB": { startYear: 2019, endYear: 2024 },
      "GLS": { startYear: 2006, endYear: 2024 },
      "A-Class": { startYear: 1997, endYear: 2024 },
      "CLA": { startYear: 2013, endYear: 2024 },
      "SL": { startYear: 1954, endYear: 2024 },
      "AMG GT": { startYear: 2014, endYear: 2024 }
    }
  },
  "Nissan": {
    models: {
      "Altima": { startYear: 1992, endYear: 2024 },
      "Sentra": { startYear: 1982, endYear: 2024 },
      "Rogue": { startYear: 2007, endYear: 2024 },
      "Murano": { startYear: 2002, endYear: 2024 },
      "Pathfinder": { startYear: 1985, endYear: 2024 },
      "Frontier": { startYear: 1997, endYear: 2024 },
      "Titan": { startYear: 2003, endYear: 2024 },
      "370Z": { startYear: 2008, endYear: 2020 },
      "GT-R": { startYear: 2007, endYear: 2024 },
      "Kicks": { startYear: 2016, endYear: 2024 },
      "Armada": { startYear: 2003, endYear: 2024 },
      "Leaf": { startYear: 2010, endYear: 2024 }
    }
  },
  "Volkswagen": {
    models: {
      "Jetta": { startYear: 1979, endYear: 2024 },
      "Passat": { startYear: 1973, endYear: 2024 },
      "Golf": { startYear: 1974, endYear: 2024 },
      "Tiguan": { startYear: 2007, endYear: 2024 },
      "Atlas": { startYear: 2017, endYear: 2024 },
      "Beetle": { startYear: 1938, endYear: 2019 },
      "Arteon": { startYear: 2018, endYear: 2024 },
      "ID.4": { startYear: 2020, endYear: 2024 },
      "Taos": { startYear: 2021, endYear: 2024 }
    }
  },
  "Audi": {
    models: {
      "A3": { startYear: 1996, endYear: 2024 },
      "A4": { startYear: 1994, endYear: 2024 },
      "A6": { startYear: 1994, endYear: 2024 },
      "A8": { startYear: 1994, endYear: 2024 },
      "Q3": { startYear: 2011, endYear: 2024 },
      "Q5": { startYear: 2008, endYear: 2024 },
      "Q7": { startYear: 2005, endYear: 2024 },
      "Q8": { startYear: 2018, endYear: 2024 },
      "TT": { startYear: 1998, endYear: 2023 },
      "R8": { startYear: 2006, endYear: 2024 },
      "e-tron": { startYear: 2018, endYear: 2024 }
    }
  },
  "Hyundai": {
    models: {
      "Elantra": { startYear: 1990, endYear: 2024 },
      "Sonata": { startYear: 1985, endYear: 2024 },
      "Tucson": { startYear: 2004, endYear: 2024 },
      "Santa Fe": { startYear: 2000, endYear: 2024 },
      "Accent": { startYear: 1994, endYear: 2024 },
      "Veloster": { startYear: 2011, endYear: 2022 },
      "Palisade": { startYear: 2019, endYear: 2024 },
      "Kona": { startYear: 2017, endYear: 2024 },
      "Venue": { startYear: 2019, endYear: 2024 },
      "Genesis": { startYear: 2008, endYear: 2016 },
      "Ioniq": { startYear: 2016, endYear: 2024 }
    }
  },
  "Kia": {
    models: {
      "Forte": { startYear: 2009, endYear: 2024 },
      "Optima": { startYear: 2000, endYear: 2020 },
      "K5": { startYear: 2020, endYear: 2024 },
      "Sportage": { startYear: 1993, endYear: 2024 },
      "Sorento": { startYear: 2002, endYear: 2024 },
      "Soul": { startYear: 2009, endYear: 2024 },
      "Stinger": { startYear: 2017, endYear: 2024 },
      "Telluride": { startYear: 2019, endYear: 2024 },
      "Niro": { startYear: 2016, endYear: 2024 },
      "Seltos": { startYear: 2019, endYear: 2024 },
      "Rio": { startYear: 1999, endYear: 2024 },
      "Cadenza": { startYear: 2013, endYear: 2020 }
    }
  },
  "Mazda": {
    models: {
      "Mazda3": { startYear: 2003, endYear: 2024 },
      "Mazda6": { startYear: 2002, endYear: 2021 },
      "CX-3": { startYear: 2015, endYear: 2021 },
      "CX-5": { startYear: 2012, endYear: 2024 },
      "CX-9": { startYear: 2006, endYear: 2024 },
      "CX-30": { startYear: 2019, endYear: 2024 },
      "CX-50": { startYear: 2022, endYear: 2024 },
      "MX-5 Miata": { startYear: 1989, endYear: 2024 },
      "MX-30": { startYear: 2021, endYear: 2024 },
      "Tribute": { startYear: 2000, endYear: 2011 },
      "RX-8": { startYear: 2003, endYear: 2012 }
    }
  },
  "Subaru": {
    models: {
      "Impreza": { startYear: 1992, endYear: 2024 },
      "Legacy": { startYear: 1989, endYear: 2024 },
      "Outback": { startYear: 1994, endYear: 2024 },
      "Forester": { startYear: 1997, endYear: 2024 },
      "Ascent": { startYear: 2018, endYear: 2024 },
      "Crosstrek": { startYear: 2012, endYear: 2024 },
      "WRX": { startYear: 2001, endYear: 2024 },
      "BRZ": { startYear: 2012, endYear: 2024 },
      "Tribeca": { startYear: 2005, endYear: 2014 },
      "Baja": { startYear: 2002, endYear: 2006 },
      "Solterra": { startYear: 2022, endYear: 2024 }
    }
  },
  "Jeep": {
    models: {
      "Wrangler": { startYear: 1986, endYear: 2024 },
      "Grand Cherokee": { startYear: 1992, endYear: 2024 },
      "Cherokee": { startYear: 1984, endYear: 2024 },
      "Compass": { startYear: 2006, endYear: 2024 },
      "Renegade": { startYear: 2014, endYear: 2024 },
      "Gladiator": { startYear: 2019, endYear: 2024 },
      "Grand Wagoneer": { startYear: 2021, endYear: 2024 },
      "Wagoneer": { startYear: 2021, endYear: 2024 },
      "Patriot": { startYear: 2006, endYear: 2017 },
      "Liberty": { startYear: 2001, endYear: 2012 },
      "Commander": { startYear: 2005, endYear: 2010 }
    }
  },
  "Ram": {
    models: {
      "1500": { startYear: 2010, endYear: 2024 },
      "2500": { startYear: 2010, endYear: 2024 },
      "3500": { startYear: 2010, endYear: 2024 },
      "ProMaster": { startYear: 2013, endYear: 2024 },
      "ProMaster City": { startYear: 2014, endYear: 2024 }
    }
  },
  "Dodge": {
    models: {
      "Charger": { startYear: 2005, endYear: 2024 },
      "Challenger": { startYear: 2008, endYear: 2024 },
      "Durango": { startYear: 1997, endYear: 2024 },
      "Journey": { startYear: 2008, endYear: 2020 },
      "Grand Caravan": { startYear: 1983, endYear: 2020 },
      "Dart": { startYear: 2012, endYear: 2016 },
      "Avenger": { startYear: 1994, endYear: 2014 },
      "Caliber": { startYear: 2006, endYear: 2012 },
      "Neon": { startYear: 1994, endYear: 2005 },
      "Viper": { startYear: 1991, endYear: 2017 }
    }
  },
  "Chrysler": {
    models: {
      "300": { startYear: 2004, endYear: 2024 },
      "Pacifica": { startYear: 2016, endYear: 2024 },
      "Voyager": { startYear: 2019, endYear: 2024 },
      "200": { startYear: 2010, endYear: 2017 },
      "Town & Country": { startYear: 1989, endYear: 2016 },
      "Sebring": { startYear: 1994, endYear: 2010 },
      "PT Cruiser": { startYear: 2000, endYear: 2010 },
      "Crossfire": { startYear: 2003, endYear: 2008 }
    }
  },
  "GMC": {
    models: {
      "Sierra": { startYear: 1987, endYear: 2024 },
      "Acadia": { startYear: 2006, endYear: 2024 },
      "Terrain": { startYear: 2009, endYear: 2024 },
      "Yukon": { startYear: 1991, endYear: 2024 },
      "Canyon": { startYear: 2003, endYear: 2024 },
      "Savana": { startYear: 1995, endYear: 2024 },
      "Envoy": { startYear: 1997, endYear: 2009 },
      "Jimmy": { startYear: 1969, endYear: 2005 },
      "Hummer EV": { startYear: 2021, endYear: 2024 }
    }
  },
  "Cadillac": {
    models: {
      "Escalade": { startYear: 1998, endYear: 2024 },
      "XT4": { startYear: 2018, endYear: 2024 },
      "XT5": { startYear: 2016, endYear: 2024 },
      "XT6": { startYear: 2019, endYear: 2024 },
      "CT4": { startYear: 2019, endYear: 2024 },
      "CT5": { startYear: 2019, endYear: 2024 },
      "Lyriq": { startYear: 2022, endYear: 2024 },
      "ATS": { startYear: 2012, endYear: 2019 },
      "CTS": { startYear: 2002, endYear: 2019 },
      "XTS": { startYear: 2012, endYear: 2019 },
      "SRX": { startYear: 2003, endYear: 2016 }
    }
  },
  "Buick": {
    models: {
      "Encore": { startYear: 2012, endYear: 2024 },
      "Encore GX": { startYear: 2019, endYear: 2024 },
      "Envision": { startYear: 2015, endYear: 2024 },
      "Enclave": { startYear: 2007, endYear: 2024 },
      "Regal": { startYear: 1973, endYear: 2020 },
      "LaCrosse": { startYear: 2004, endYear: 2019 },
      "Verano": { startYear: 2011, endYear: 2017 },
      "Lucerne": { startYear: 2005, endYear: 2011 }
    }
  },
  "Lincoln": {
    models: {
      "Navigator": { startYear: 1997, endYear: 2024 },
      "Aviator": { startYear: 2002, endYear: 2024 },
      "Corsair": { startYear: 2019, endYear: 2024 },
      "Nautilus": { startYear: 2018, endYear: 2024 },
      "Continental": { startYear: 1939, endYear: 2020 },
      "MKZ": { startYear: 2006, endYear: 2020 },
      "MKC": { startYear: 2014, endYear: 2019 },
      "MKX": { startYear: 2006, endYear: 2018 },
      "Town Car": { startYear: 1980, endYear: 2011 }
    }
  },
  "Acura": {
    models: {
      "TLX": { startYear: 2014, endYear: 2024 },
      "ILX": { startYear: 2012, endYear: 2022 },
      "MDX": { startYear: 2000, endYear: 2024 },
      "RDX": { startYear: 2006, endYear: 2024 },
      "NSX": { startYear: 1990, endYear: 2024 },
      "Integra": { startYear: 1985, endYear: 2024 },
      "TL": { startYear: 1995, endYear: 2014 },
      "TSX": { startYear: 2003, endYear: 2014 },
      "RSX": { startYear: 2001, endYear: 2006 },
      "RL": { startYear: 1995, endYear: 2012 }
    }
  },
  "Infiniti": {
    models: {
      "Q50": { startYear: 2013, endYear: 2024 },
      "Q60": { startYear: 2016, endYear: 2024 },
      "QX50": { startYear: 2018, endYear: 2024 },
      "QX60": { startYear: 2012, endYear: 2024 },
      "QX80": { startYear: 2013, endYear: 2024 },
      "G35": { startYear: 2002, endYear: 2008 },
      "G37": { startYear: 2007, endYear: 2013 },
      "FX35": { startYear: 2002, endYear: 2013 },
      "FX50": { startYear: 2008, endYear: 2013 },
      "M35": { startYear: 2005, endYear: 2010 }
    }
  },
  "Lexus": {
    models: {
      "ES": { startYear: 1989, endYear: 2024 },
      "IS": { startYear: 1998, endYear: 2024 },
      "GS": { startYear: 1993, endYear: 2020 },
      "LS": { startYear: 1989, endYear: 2024 },
      "NX": { startYear: 2014, endYear: 2024 },
      "RX": { startYear: 1998, endYear: 2024 },
      "GX": { startYear: 2002, endYear: 2024 },
      "LX": { startYear: 1995, endYear: 2024 },
      "UX": { startYear: 2018, endYear: 2024 },
      "LC": { startYear: 2017, endYear: 2024 },
      "RC": { startYear: 2014, endYear: 2024 }
    }
  },
  "Genesis": {
    models: {
      "G70": { startYear: 2018, endYear: 2024 },
      "G80": { startYear: 2020, endYear: 2024 },
      "G90": { startYear: 2016, endYear: 2024 },
      "GV60": { startYear: 2022, endYear: 2024 },
      "GV70": { startYear: 2021, endYear: 2024 },
      "GV80": { startYear: 2020, endYear: 2024 },
      "Electrified G80": { startYear: 2022, endYear: 2024 },
      "Electrified GV70": { startYear: 2022, endYear: 2024 }
    }
  },
  "Tesla": {
    models: {
      "Model S": { startYear: 2012, endYear: 2024 },
      "Model 3": { startYear: 2017, endYear: 2024 },
      "Model X": { startYear: 2015, endYear: 2024 },
      "Model Y": { startYear: 2019, endYear: 2024 },
      "Cybertruck": { startYear: 2023, endYear: 2024 },
      "Roadster": { startYear: 2008, endYear: 2012 }
    }
  },
  "Volvo": {
    models: {
      "XC40": { startYear: 2017, endYear: 2024 },
      "XC60": { startYear: 2008, endYear: 2024 },
      "XC90": { startYear: 2002, endYear: 2024 },
      "S60": { startYear: 2000, endYear: 2024 },
      "S90": { startYear: 1996, endYear: 2024 },
      "V60": { startYear: 2010, endYear: 2024 },
      "V90": { startYear: 1996, endYear: 2024 },
      "C30": { startYear: 2006, endYear: 2013 },
      "C70": { startYear: 1996, endYear: 2013 },
      "S40": { startYear: 1995, endYear: 2011 }
    }
  },
  "Mitsubishi": {
    models: {
      "Outlander": { startYear: 2003, endYear: 2024 },
      "Eclipse Cross": { startYear: 2017, endYear: 2024 },
      "Mirage": { startYear: 2013, endYear: 2024 },
      "Outlander Sport": { startYear: 2010, endYear: 2021 },
      "Lancer": { startYear: 2001, endYear: 2017 },
      "Eclipse": { startYear: 1989, endYear: 2012 },
      "Galant": { startYear: 1988, endYear: 2012 },
      "Montero": { startYear: 1982, endYear: 2006 },
      "3000GT": { startYear: 1990, endYear: 1999 }
    }
  }
};

// Helper functions
const getAllMakes = () => {
  return Object.keys(vehicleDatabase).sort();
};

const getModelsForMake = (make) => {
  if (!vehicleDatabase[make]) return [];
  return Object.keys(vehicleDatabase[make].models).sort();
};

const getYearsForMakeModel = (make, model) => {
  if (!vehicleDatabase[make] || !vehicleDatabase[make].models[model]) return [];
  
  const { startYear, endYear } = vehicleDatabase[make].models[model];
  const years = [];
  
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
};

const isValidCombination = (make, model, year) => {
  if (!vehicleDatabase[make] || !vehicleDatabase[make].models[model]) {
    return false;
  }
  
  const { startYear, endYear } = vehicleDatabase[make].models[model];
  return year >= startYear && year <= endYear;
};

const searchMakes = (query) => {
  if (!query) return getAllMakes();
  
  const lowerQuery = query.toLowerCase();
  return getAllMakes().filter(make => 
    make.toLowerCase().includes(lowerQuery)
  );
};

const searchModels = (make, query) => {
  const models = getModelsForMake(make);
  if (!query) return models;
  
  const lowerQuery = query.toLowerCase();
  return models.filter(model => 
    model.toLowerCase().includes(lowerQuery)
  );
};

const getTankCapacity = (make, model, year) => {
  if (!vehicleDatabase[make] || !vehicleDatabase[make].models[model]) {
    return null;
  }
  
  const modelData = vehicleDatabase[make].models[model];
  if (!modelData.tankCapacity) {
    return null;
  }
  
  const tankCapacityData = modelData.tankCapacity;
  
  // Try to find the year range that matches
  for (const [yearRange, capacity] of Object.entries(tankCapacityData)) {
    if (yearRange === 'default') continue;
    
    // Parse year range (e.g., "2018-2024")
    const [startYear, endYear] = yearRange.split('-').map(y => parseInt(y));
    
    if (year >= startYear && year <= endYear) {
      return capacity;
    }
  }
  
  // Return default if no specific range matches
  return tankCapacityData.default || null;
};

module.exports = {
  vehicleDatabase,
  getAllMakes,
  getModelsForMake,
  getYearsForMakeModel,
  isValidCombination,
  searchMakes,
  searchModels,
  getTankCapacity
};

const deptOfftake = [
    {
      department: "MCD",
      annualTarget: 220000,
      offtakeStatus: { "off_1": 31701, "off_2": 1331, "total_off": 33032 },
      achievedPercentage: 15.01,
      locations: {
        shastriPark: { "off_1": 7851.24, "off_2": 478.32 },
        burari: { "off_1": 12867.21, "off_2": 396.68 },
        ranikhera: { "off_1": 10304.76, "off_2": 416.75 },
        mundka: { "off_1": 677.41, "off_2": 39.18 }
      },
      total: 33031.55
    },
    {
      department: "DDA",
      annualTarget: 110000,
      offtakeStatus: { "off_1": 5065, "off_2": 55, "total_off": 5120 },
      achievedPercentage: 4.65,
      locations: {
        shastriPark: { "off_1": 1727.395, "off_2": 55.28 },
        burari: { "off_1": 721.03, "off_2": 0 },
        ranikhera: { "off_1": 2529.89, "off_2": 0 },
        mundka: { "off_1": 86.64, "off_2": 0 }
      },
      total: 5120.24
    },
    {
      department: "DSIIDC",
      annualTarget: 154000,
      offtakeStatus: { "off_1": 359, "off_2": 147, "total_off": 506 },
      achievedPercentage: 0.33,
      locations: {
        shastriPark: { "off_1": 0, "off_2": 0 },
        burari: { "off_1": 0, "off_2": 0 },
        ranikhera: { "off_1": 358.83, "off_2": 147.01 },
        mundka: { "off_1": 0, "off_2": 0 }
      },
      total: 505.84
    },
    {
      department: "I&FC",
      annualTarget: 220000,
      offtakeStatus: { "off_1": 41335, "off_2": 1493, "total_off": 42828 },
      achievedPercentage: 19.47,
      locations: {
        shastriPark: { "off_1": 3469.43, "off_2": 292.42 },
        burari: { "off_1": 25132.48, "off_2": 753.33 },
        ranikhera: { "off_1": 12373.32, "off_2": 447.61 },
        mundka: { "off_1": 359.9, "off_2": 0 }
      },
      total: 42828.49
    },
    {
      department: "NDMC",
      annualTarget: 26250,
      offtakeStatus: { "off_1": 1181, "off_2": 249, "total_off": 1430 },
      achievedPercentage: 5.45,
      locations: {
        shastriPark: { "off_1": 928.53, "off_2": 231.49 },
        burari: { "off_1": 175.06, "off_2": 17.99 },
        ranikhera: { "off_1": 65.04, "off_2": 0 },
        mundka: { "off_1": 11.95, "off_2": 0 }
      },
      total: 1430.06
    },
    {
      department: "PWD",
      annualTarget: 110000,
      offtakeStatus: { "off_1": 941, "off_2": 0, "total_off": 941 },
      achievedPercentage: 0.86,
      locations: {
        shastriPark: { "off_1": 225.07, "off_2": 0 },
        burari: { "off_1": 599.22, "off_2": 17.99 },
        ranikhera: { "off_1": 44.36, "off_2": 0 },
        mundka: { "off_1": 72.79, "off_2": 0.46 }
      },
      total: 941.90
    },
    {
      department: "CPWD",
      annualTarget: 110000,
      offtakeStatus: { "off_1": 337, "off_2": 0, "total_off": 337 },
      achievedPercentage: 0.31,
      locations: {
        shastriPark: { "off_1": 190.46, "off_2": 0 },
        burari: { "off_1": 0, "off_2": 0 },
        ranikhera: { "off_1": 90.11, "off_2": 0 },
        mundka: { "off_1": 56.35, "off_2": 0 }
      },
      total: 336.92
    },
    {
      department: "NBCC",
      annualTarget: 110000,
      offtakeStatus: { "off_1": 0, "off_2": 0, "total_off": 0 },
      achievedPercentage: 0,
      locations: {
        shastriPark: { "off_1": 0, "off_2": 0 },
        burari: { "off_1": 0, "off_2": 0 },
        ranikhera: { "off_1": 0, "off_2": 0 },
        mundka: { "off_1": 0, "off_2": 0 }
      },
      total: 0
    },
    {
      department: "DMRC",
      annualTarget: 11000,
      offtakeStatus: { "off_1": 241, "off_2": 179, "total_off": 420 },
      achievedPercentage: 3.82,
      locations: {
        shastriPark: { "off_1": 0, "off_2": 0 },
        burari: { "off_1": 0, "off_2": 147.54 },
        ranikhera: { "off_1": 0, "off_2": 0 },
        mundka: { "off_1": 241.37, "off_2": 31.47 }
      },
      total: 420.38
    },
    {
      department: "Railway Board",
      annualTarget: 11000,
      offtakeStatus: { "off_1": 6, "off_2": 0, "total_off": 6 },
      achievedPercentage: 0.05,
      locations: {
        shastriPark: { "off_1": 0, "off_2": 0 },
        burari: { "off_1": 0, "off_2": 0 },
        ranikhera: { "off_1": 5.54, "off_2": 0 },
        mundka: { "off_1": 0, "off_2": 0 }
      },
      total: 5.54
    },
    {
      department: "NCRTC",
      annualTarget: 5250,
      offtakeStatus: { "off_1": 624, "off_2": 190, "total_off": 814 },
      achievedPercentage: 15.50,
      locations: {
        shastriPark: { "off_1": 238.61, "off_2": 106.09 },
        burari: { "off_1": 0, "off_2": 0 },
        ranikhera: { "off_1": 14.62, "off_2": 0 },
        mundka: { "off_1": 370.27, "off_2": 84.00 }
      },
      total: 813.59
    },
    {
      department: "DJB",
      annualTarget: 5500,
      offtakeStatus: { "off_1": 7155, "off_2": 35, "total_off": 7190 },
      achievedPercentage: 130.72,
      locations: {
        shastriPark: { "off_1": 70.8, "off_2": 5.38 },
        burari: { "off_1": 175.04, "off_2": 5.82 },
        ranikhera: { "off_1": 6908.84, "off_2": 23.88 },
        mundka: { "off_1": 0, "off_2": 0 }
      },
      total: 7189.76
    },
    {
      department: "DTTDC",
      annualTarget: 5250,
      offtakeStatus: { "off_1": 14, "off_2": 0, "total_off": 14 },
      achievedPercentage: 0.26,
      locations: {
        shastriPark: { "off_1": 0, "off_2": 0 },
        burari: { "off_1": 0, "off_2": 0 },
        ranikhera: { "off_1": 13.63, "off_2": 0 },
        mundka: { "off_1": 0, "off_2": 0 }
      },
      total: 13.63
    },
    {
      department: "DUSIB",
      annualTarget: 5250,
      offtakeStatus: { "off_1": 455, "off_2": 78, "total_off": 533 },
      achievedPercentage: 10.15,
      locations: {
        shastriPark: { "off_1": 42.26, "off_2": 0 },
        burari: { "off_1": 370.32, "off_2": 78.34 },
        ranikhera: { "off_1": 42.14, "off_2": 0 },
        mundka: { "off_1": 0, "off_2": 0 }
      },
      total: 533.06
    },
    {
      department: "Delhi Cantonment Board",
      annualTarget: 5500,
      offtakeStatus: { "off_1": 0, "off_2": 0, "total_off": 0 },
      achievedPercentage: 0,
      locations: {
        shastriPark: { "off_1": 0, "off_2": 0 },
        burari: { "off_1": 0, "off_2": 0 },
        ranikhera: { "off_1": 0, "off_2": 0 },
        mundka: { "off_1": 0, "off_2": 0 }
      },
      total: 1430.06
    },
    {
      department: "Delhi Transco & Others",
      annualTarget: 52500,
      offtakeStatus: { "off_1": 715, "off_2": 29, "total_off": 744 },
      achievedPercentage: 1.42,
      locations: {
        shastriPark: { "off_1": 358.47, "off_2": 22.87 },
        burari: { "off_1": 26.41, "off_2": 6.52 },
        ranikhera: { "off_1": 320.51, "off_2": 0 },
        mundka: { "off_1": 9.66, "off_2": 0 }
      },
      total: 744.44
    },
    {
      department: "NHAI",
      annualTarget: 440000,
      offtakeStatus: { "off_1": 9, "off_2": 0, "total_off": 9 },
      achievedPercentage: 0.00,
      locations: {
        shastriPark: { "off_1": 0, "off_2": 0 },
        burari: { "off_1": 0, "off_2": 0 },
        ranikhera: { "off_1": 8.63, "off_2": 0 },
        mundka: { "off_1": 0, "off_2": 0 }
      },
      total: 8.63
    }
  ];
  

  export default deptOfftake;
  
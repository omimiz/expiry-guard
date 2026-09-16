import type { LoyaltyProgram } from '../types'

export const LOYALTY_CATALOG: LoyaltyProgram[] = [
  {
    id: 'emirates-skywards',
    name: 'Emirates Skywards',
    shortCode: 'EK',
    category: 'airlines',
    brandColor: '#D71921',
    accentColor: '#8C0E14',
    textColor: '#FFFFFF',
    iconKey: 'plane',
    policyType: 'fixed_tenure',
    validityMonths: 36, // 3 years from activity month
    pointUnit: 'Miles',
    valuationPerPointCents: 1.2, // ~1.2¢ per mile
    officialPolicySummary: 'Miles are valid for 3 years from the date of the travel/activity. In the calendar year in which they are due to expire, they expire at the end of your birth month.',
    rescueActions: [
      {
        title: 'Transfer Points to Family or Partner',
        description: 'Extend or preserve miles by pooling them into a Skywards Family Account or paying a modest fee to extend by 12 months.',
        effort: 'low_cost',
        partnerExample: 'Skywards Family Pool / Paid Extension',
        actionHint: 'Instant rescue before end of birth month'
      },
      {
        title: 'Book a Skywards Partner Hotel or Car',
        description: 'Book a 1-night stay or rental car through Emirates Skywards Hotels to burn expiring small balances.',
        effort: 'partner',
        partnerExample: 'Rocketmiles / Emirates Hotels'
      },
      {
        title: 'Redeem for Dubai Duty Free or Lifestyle Voucher',
        description: 'Spend miles starting at 4,500 miles on retail vouchers or in-flight Wi-Fi vouchers.',
        effort: 'instant_free',
        partnerExample: 'Dubai Duty Free / Arabian Adventures'
      }
    ]
  },
  {
    id: 'marriott-bonvoy',
    name: 'Marriott Bonvoy',
    shortCode: 'MB',
    category: 'hotels',
    brandColor: '#B08D57',
    accentColor: '#1C1917',
    textColor: '#FFFFFF',
    iconKey: 'hotel',
    policyType: 'rolling_inactivity',
    validityMonths: 24, // 24 months rolling
    pointUnit: 'Points',
    valuationPerPointCents: 0.8, // ~0.8¢ per point
    officialPolicySummary: 'Points expire after 24 months of inactivity. Any qualifying earning or redemption resets the clock for ALL points in your balance.',
    rescueActions: [
      {
        title: 'Transfer 1,000 Points from Amex or Chase',
        description: 'Transfer a minimum of 1,000 credit card points to your Bonvoy account. This instantly resets your 24-month clock.',
        effort: 'transfer',
        partnerExample: 'Amex Membership Rewards / Chase Ultimate Rewards',
        actionHint: 'Instant 24-month extension'
      },
      {
        title: 'Dine via Marriott Eat Around Town',
        description: 'Link any debit or credit card to Eat Around Town and spend $5 at a participating café or restaurant.',
        effort: 'instant_free',
        partnerExample: 'Eat Around Town by Marriott'
      },
      {
        title: 'Buy 1,000 Points for $12.50',
        description: 'The fastest fail-safe: purchase the minimum 1,000 points bundle directly on Marriott.com to buy another 2 years.',
        effort: 'low_cost',
        partnerExample: 'Marriott Points Store'
      }
    ]
  },
  {
    id: 'hilton-honors',
    name: 'Hilton Honors',
    shortCode: 'HH',
    category: 'hotels',
    brandColor: '#002B49',
    accentColor: '#005288',
    textColor: '#FFFFFF',
    iconKey: 'hotel',
    policyType: 'rolling_inactivity',
    validityMonths: 24,
    pointUnit: 'Points',
    valuationPerPointCents: 0.5,
    officialPolicySummary: 'Points expire after 24 consecutive months of no eligible activity. Any qualifying earn or redeem event keeps all points active.',
    rescueActions: [
      {
        title: 'Take a $5 Lyft Ride with Linked Account',
        description: 'Link your Hilton Honors account to Lyft. Earning points on a single ride immediately resets your 24-month clock.',
        effort: 'instant_free',
        partnerExample: 'Hilton + Lyft Auto-Earn',
        actionHint: 'Zero extra cost if you ride rideshares'
      },
      {
        title: 'Dine with Hilton Honors Dining',
        description: 'Register any payment card and grab a coffee or meal at any listed local bakery or restaurant.',
        effort: 'instant_free',
        partnerExample: 'Hilton Honors Dining Network'
      },
      {
        title: 'Transfer 1,000 Amex Membership Rewards',
        description: 'Convert Amex points to Hilton (normally 1:2 ratio) to immediately trigger a reset.',
        effort: 'transfer',
        partnerExample: 'American Express MR'
      }
    ]
  },
  {
    id: 'starbucks-rewards',
    name: 'Starbucks Rewards',
    shortCode: 'SBUX',
    category: 'dining',
    brandColor: '#006241',
    accentColor: '#1E3932',
    textColor: '#FFFFFF',
    iconKey: 'coffee',
    policyType: 'rolling_inactivity',
    validityMonths: 6, // 6 months per cluster
    pointUnit: 'Stars',
    valuationPerPointCents: 3.5, // 100 stars = $3.50+ coffee
    officialPolicySummary: 'Stars expire 6 months after the calendar month in which they were earned unless you hold a Starbucks Rewards Visa card.',
    rescueActions: [
      {
        title: 'Redeem 25 Stars for an Espresso Shot or Syrup',
        description: 'Spend as few as 25 Stars to customize your coffee or 100 Stars for a brewed hot coffee/bakery item.',
        effort: 'instant_free',
        partnerExample: 'Starbucks App Order'
      },
      {
        title: 'Gift a Drink to a Friend with Stars',
        description: 'Order ahead for pickup for a friend or family member before your star batch vanishes.',
        effort: 'instant_free',
        partnerExample: 'Starbucks Mobile Pickup'
      },
      {
        title: 'Link with Delta SkyMiles / Bank of America',
        description: 'Earn double stars on Starbucks days and sync accounts to keep star rewards flowing.',
        effort: 'partner',
        partnerExample: 'Delta + Starbucks Sync'
      }
    ]
  },
  {
    id: 'carrefour-share',
    name: 'Carrefour SHARE / Majid Al Futtaim',
    shortCode: 'SHARE',
    category: 'retail',
    brandColor: '#004B87',
    accentColor: '#E2001A',
    textColor: '#FFFFFF',
    iconKey: 'shopping-bag',
    policyType: 'fixed_calendar',
    validityMonths: 12,
    fixedMonth: 12,
    fixedDay: 31,
    pointUnit: 'SHARE Pts',
    valuationPerPointCents: 1.0, // 10 pts = 1 AED ($0.27)
    officialPolicySummary: 'Points expire on December 31st of the following calendar year, or after 12-24 months depending on campaign terms.',
    rescueActions: [
      {
        title: 'Pay at Carrefour Cashier with Points',
        description: 'Scan your SHARE app barcode at any Carrefour self-checkout and tap "Pay with Points" for even $1 worth.',
        effort: 'instant_free',
        partnerExample: 'Carrefour Grocery Checkout',
        actionHint: 'Instant redemption'
      },
      {
        title: 'Redeem at VOX Cinemas or Magic Planet',
        description: 'Use points to buy movie tickets, popcorn, or arcade credits across Majid Al Futtaim malls.',
        effort: 'instant_free',
        partnerExample: 'VOX Cinemas'
      },
      {
        title: 'Donate Points to Charity in the App',
        description: 'Do not let points expire into corporate pockets: donate any balance starting at 100 points to Red Crescent in 1 tap.',
        effort: 'instant_free',
        partnerExample: 'SHARE App Charity Hub'
      }
    ]
  },
  {
    id: 'flying-blue',
    name: 'Air France / KLM Flying Blue',
    shortCode: 'AF/KL',
    category: 'airlines',
    brandColor: '#051039',
    accentColor: '#174092',
    textColor: '#FFFFFF',
    iconKey: 'plane',
    policyType: 'rolling_inactivity',
    validityMonths: 24,
    pointUnit: 'Miles',
    valuationPerPointCents: 1.3,
    officialPolicySummary: 'Miles expire after 24 months without an eligible earning activity (or flying activity for non-elite members).',
    rescueActions: [
      {
        title: 'Earn Miles via Online Shopping Portal',
        description: 'Buy something you already need through the Flying Blue Earn Online mall (Apple, Nike, Booking.com).',
        effort: 'instant_free',
        partnerExample: 'Flying Blue Shop for Miles'
      },
      {
        title: 'Transfer 1,000 Points from Revolut, Chase, or Amex',
        description: 'Flying Blue is a universal 1:1 transfer partner with almost all major card rewards.',
        effort: 'transfer',
        partnerExample: 'Amex, Chase, Citi, Capital One'
      },
      {
        title: 'Donate 2,000 Miles to an NGO',
        description: 'Donate a modest slice of miles to Aviation Sans Frontières or Ocean Cleanup to trigger activity.',
        effort: 'instant_free',
        partnerExample: 'Flying Blue Charity Store'
      }
    ]
  },
  {
    id: 'qatar-privilege-club',
    name: 'Qatar Airways Privilege Club',
    shortCode: 'QR',
    category: 'airlines',
    brandColor: '#5C0632',
    accentColor: '#300319',
    textColor: '#FFFFFF',
    iconKey: 'plane',
    policyType: 'rolling_inactivity',
    validityMonths: 36, // 36 months rolling
    pointUnit: 'Avios',
    valuationPerPointCents: 1.4,
    officialPolicySummary: 'Avios remain valid for 36 months. Any qualifying transaction (earn or spend) extends all your Avios for another 36 months.',
    rescueActions: [
      {
        title: 'Link with British Airways Avios & Move 100 Avios',
        description: 'Privilege Club links 1:1 for free with British Airways. Moving even 100 Avios triggers an activity pulse.',
        effort: 'instant_free',
        partnerExample: 'British Airways / Qatar Avios Bridge',
        actionHint: 'Instant free 36-month reset'
      },
      {
        title: 'Earn Avios on Hotel Bookings',
        description: 'Book any upcoming trip hotel stay via Qatar Airways Holidays or Booking.com portal.',
        effort: 'partner',
        partnerExample: 'Qatar Airways Hotels'
      },
      {
        title: 'Spend at Qatar Duty Free (Hamad International)',
        description: 'Scan your boarding pass or digital membership card when purchasing chocolate or perfume in Doha.',
        effort: 'instant_free',
        partnerExample: 'Qatar Duty Free DOH'
      }
    ]
  },
  {
    id: 'british-airways-exec-club',
    name: 'British Airways Executive Club',
    shortCode: 'BA',
    category: 'airlines',
    brandColor: '#075AAA',
    accentColor: '#EB2226',
    textColor: '#FFFFFF',
    iconKey: 'plane',
    policyType: 'rolling_inactivity',
    validityMonths: 36,
    pointUnit: 'Avios',
    valuationPerPointCents: 1.4,
    officialPolicySummary: 'Avios do not expire as long as you collect, spend, purchase, or share at least one Avios every 36 months.',
    rescueActions: [
      {
        title: 'Complete a $1 Purchase via BA Shopping Mall',
        description: 'Click through the BA eStore before buying anything online (Deliveroo, eBay, Boots) to earn 1+ Avios.',
        effort: 'low_cost',
        partnerExample: 'British Airways Shopping eStore',
        actionHint: 'Resets clock for 3 full years'
      },
      {
        title: 'Transfer 1,000 Amex or Chase Points',
        description: 'Instantly transfer 1,000 points to reset the timer for your entire Avios pool.',
        effort: 'transfer',
        partnerExample: 'Amex MR / Chase UR'
      },
      {
        title: 'Link with Uber UK (if eligible)',
        description: 'Link your BA account to Uber to earn 1 Avios per £1 spent on rides, trains, and coaches.',
        effort: 'instant_free',
        partnerExample: 'Uber UK + BA Integration'
      }
    ]
  },
  {
    id: 'world-of-hyatt',
    name: 'World of Hyatt',
    shortCode: 'HYATT',
    category: 'hotels',
    brandColor: '#8C7355',
    accentColor: '#2B2B2B',
    textColor: '#FFFFFF',
    iconKey: 'hotel',
    policyType: 'rolling_inactivity',
    validityMonths: 24,
    pointUnit: 'Points',
    valuationPerPointCents: 1.8, // Highest valued hotel points (~1.8¢)
    officialPolicySummary: 'Points are forfeited after 24 consecutive months of account inactivity. Any earn or burn resets the clock.',
    rescueActions: [
      {
        title: 'Transfer 1,000 Chase Ultimate Rewards Points',
        description: 'Chase points transfer instantly 1:1 to Hyatt. Hyatt points are among the most valuable in travel.',
        effort: 'transfer',
        partnerExample: 'Chase Sapphire / Ink Preferred',
        actionHint: 'Instant 2-year extension'
      },
      {
        title: 'Dine at a Hyatt Hotel Restaurant',
        description: 'You do NOT need to stay overnight! Just enjoy brunch or a coffee at any Hyatt property and give your member number.',
        effort: 'instant_free',
        partnerExample: 'Hyatt Dining Earn Program'
      },
      {
        title: 'Link Hyatt with American Airlines AAdvantage',
        description: 'Elite members can dual-earn AA miles and Hyatt points on flights and stays.',
        effort: 'partner',
        partnerExample: 'Hyatt & AA Dual Status'
      }
    ]
  },
  {
    id: 'singapore-krisflyer',
    name: 'Singapore Airlines KrisFlyer',
    shortCode: 'SQ',
    category: 'airlines',
    brandColor: '#00266B',
    accentColor: '#D99B26',
    textColor: '#FFFFFF',
    iconKey: 'plane',
    policyType: 'fixed_tenure',
    validityMonths: 36, // 36 months fixed
    pointUnit: 'Miles',
    valuationPerPointCents: 1.3,
    officialPolicySummary: 'KrisFlyer miles are valid for 3 years from the month earned. Activity does NOT automatically reset past miles; they must be spent or extended with a fee.',
    rescueActions: [
      {
        title: 'Spend Miles on KrisShop Merchandise',
        description: 'Redeem small expiring balances on KrisShop for tech, cosmetics, or wine with doorstep delivery.',
        effort: 'instant_free',
        partnerExample: 'KrisShop.com'
      },
      {
        title: 'Convert Miles to KrisPay / Pelago Vouchers',
        description: 'Transfer miles into Kris+ app or Pelago travel experiences to avoid complete expiration.',
        effort: 'transfer',
        partnerExample: 'Kris+ Mobile App / Pelago'
      },
      {
        title: 'Pay to Extend Miles by 6-12 Months',
        description: 'Pay a small fee ($12 per 10,000 miles or 1,200 miles) to extend expiring miles for up to a year.',
        effort: 'low_cost',
        partnerExample: 'KrisFlyer Mile Extension'
      }
    ]
  },
  {
    id: 'ihg-one-rewards',
    name: 'IHG One Rewards',
    shortCode: 'IHG',
    category: 'hotels',
    brandColor: '#E95420',
    accentColor: '#5C1D06',
    textColor: '#FFFFFF',
    iconKey: 'hotel',
    policyType: 'rolling_inactivity',
    validityMonths: 12, // 12 months for Club, never for Elite
    pointUnit: 'Points',
    valuationPerPointCents: 0.5,
    officialPolicySummary: 'Points expire after 12 months of inactivity for Club level members. Points never expire for Silver, Gold, Platinum, and Diamond Elite members.',
    rescueActions: [
      {
        title: 'Reach Silver Elite (Never Expire)',
        description: 'Hold any IHG co-brand credit card or complete 10 qualifying nights to permanently freeze expiration.',
        effort: 'partner',
        partnerExample: 'IHG Premier Card / Elite Status',
        actionHint: 'Permanent expiration immunity'
      },
      {
        title: 'Transfer Points from Chase Ultimate Rewards',
        description: 'Move 1,000 Chase points to IHG to instantly reset your 12-month clock.',
        effort: 'transfer',
        partnerExample: 'Chase Ultimate Rewards'
      },
      {
        title: 'Earn 10 Points via IHG Dining',
        description: 'Spend $3 at a participating restaurant to keep points active for another 365 days.',
        effort: 'instant_free',
        partnerExample: 'IHG Dine & Earn'
      }
    ]
  },
  {
    id: 'sephora-beauty-insider',
    name: 'Sephora Beauty Insider',
    shortCode: 'SEPH',
    category: 'retail',
    brandColor: '#000000',
    accentColor: '#333333',
    textColor: '#FFFFFF',
    iconKey: 'sparkles',
    policyType: 'rolling_inactivity',
    validityMonths: 12,
    pointUnit: 'Points',
    valuationPerPointCents: 2.5, // 500 points = $10 off (2.0 - 2.5¢)
    officialPolicySummary: 'Points expire after 12 consecutive months of no purchase or redemption activity.',
    rescueActions: [
      {
        title: 'Buy a $3 Travel Sheet Mask or Lip Balm',
        description: 'Make any minor purchase in-store or online using your Beauty Insider card to reset your clock for 12 months.',
        effort: 'low_cost',
        partnerExample: 'Sephora.com or retail boutique',
        actionHint: 'Instant 12-month reset'
      },
      {
        title: 'Claim Your Free Birthday Gift',
        description: 'During your birthday month, claim your 100% free gift in-store or online without minimum spend.',
        effort: 'instant_free',
        partnerExample: 'Sephora Birthday Reward'
      },
      {
        title: 'Redeem 100-250 Points in Rewards Bazaar',
        description: 'Snag a luxury perfume sample or skincare mini in the Rewards Bazaar.',
        effort: 'instant_free',
        partnerExample: 'Beauty Insider Bazaar'
      }
    ]
  },
  {
    id: 'amex-membership-rewards',
    name: 'American Express Membership Rewards',
    shortCode: 'AMEX',
    category: 'credit_card',
    brandColor: '#006FCF',
    accentColor: '#002663',
    textColor: '#FFFFFF',
    iconKey: 'credit-card',
    policyType: 'no_expiry',
    validityMonths: 0,
    pointUnit: 'MR Points',
    valuationPerPointCents: 1.8,
    officialPolicySummary: 'Points NEVER expire as long as you maintain at least one open, active Amex card enrolled in Membership Rewards.',
    rescueActions: [
      {
        title: 'Keep a Zero-Fee Card Open',
        description: 'If canceling a premium card (like Platinum or Gold), downgrade or open an Amex Everyday or Blue Business Plus to safeguard 100% of your points forever.',
        effort: 'instant_free',
        partnerExample: 'Amex Everyday Card (No Annual Fee)',
        actionHint: 'Permanent safety'
      },
      {
        title: 'Transfer to 17 Airline & Hotel Partners',
        description: 'If you ever decide to close all accounts, transfer points to British Airways, Delta, Marriott, or Hilton before closing.',
        effort: 'transfer',
        partnerExample: 'Amex Transfer Partners'
      }
    ]
  },
  {
    id: 'delta-skymiles',
    name: 'Delta SkyMiles',
    shortCode: 'DL',
    category: 'airlines',
    brandColor: '#E01933',
    accentColor: '#001940',
    textColor: '#FFFFFF',
    iconKey: 'plane',
    policyType: 'no_expiry',
    validityMonths: 0,
    pointUnit: 'SkyMiles',
    valuationPerPointCents: 1.2,
    officialPolicySummary: 'Delta SkyMiles NEVER expire! They remain safe in your account for life regardless of activity levels.',
    rescueActions: [
      {
        title: 'Expiration Immunity',
        description: 'You do not need to take any action. Delta SkyMiles have no expiration clock.',
        effort: 'instant_free',
        partnerExample: 'Delta Policy Guarantee',
        actionHint: 'Immortal points'
      }
    ]
  }
]

export const PRESET_STARTER_DECKS = [
  {
    name: 'Frequent Flyer',
    description: 'Emirates, Flying Blue, Qatar, and British Airways',
    icon: 'plane',
    programIds: ['emirates-skywards', 'flying-blue', 'qatar-privilege-club', 'british-airways-exec-club']
  },
  {
    name: 'Hotel Hopper',
    description: 'Marriott Bonvoy, Hilton Honors, and World of Hyatt',
    icon: 'hotel',
    programIds: ['marriott-bonvoy', 'hilton-honors', 'world-of-hyatt']
  },
  {
    name: 'Everyday Lifestyle',
    description: 'Starbucks, Carrefour SHARE, and Sephora',
    icon: 'sparkles',
    programIds: ['starbucks-rewards', 'carrefour-share', 'sephora-beauty-insider']
  }
]

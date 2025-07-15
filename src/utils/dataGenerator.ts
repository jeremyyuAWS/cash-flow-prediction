// Utility functions to generate sample data for the demo
// In a real app, this would be replaced with actual API calls to a backend service

import { addDays, format } from 'date-fns';

// Industry patterns
const INDUSTRY_PATTERNS = {
  retail: {
    name: 'Retail',
    seasonalityFactors: {
      // Higher sales during holidays, weekends
      inflows: [1.0, 1.0, 1.0, 1.0, 1.2, 1.5, 1.3, 1.0, 1.0, 1.0, 1.8, 2.2], // Monthly factors (Jan-Dec)
      weekdayFactors: [0.8, 0.7, 0.8, 0.9, 1.0, 1.4, 1.5], // Mon-Sun
      // Higher expenses in months before peak seasons
      outflows: [1.1, 0.9, 1.0, 1.0, 1.2, 0.9, 0.9, 1.3, 1.5, 1.8, 1.0, 0.9]
    },
    averageDSO: 15, // Days Sales Outstanding (retail has faster payment cycles)
    averageDPO: 35, // Days Payable Outstanding
    dailyVariability: 0.15, // Daily random variation
    bigEvents: [
      { name: 'Black Friday', month: 11, day: 25, inflowFactor: 3.5, outflowFactor: 1.0 },
      { name: 'Christmas', month: 12, day: 15, inflowFactor: 2.8, outflowFactor: 1.0 },
      { name: 'Back to School', month: 8, day: 15, inflowFactor: 1.8, outflowFactor: 1.1 }
    ],
    transactionCategories: {
      inflows: [
        { name: 'In-store Sales', weight: 0.5 },
        { name: 'Online Sales', weight: 0.3 },
        { name: 'Gift Card Redemption', weight: 0.1 },
        { name: 'Returns (Refunds)', weight: -0.1 },
        { name: 'Affiliate Revenue', weight: 0.05 }
      ],
      outflows: [
        { name: 'Inventory Purchase', weight: 0.4 },
        { name: 'Payroll', weight: 0.25 },
        { name: 'Rent', weight: 0.12 },
        { name: 'Marketing', weight: 0.1 },
        { name: 'Utilities', weight: 0.05 },
        { name: 'Insurance', weight: 0.03 },
        { name: 'Taxes', weight: 0.05 }
      ]
    }
  },
  manufacturing: {
    name: 'Manufacturing',
    seasonalityFactors: {
      // More stable throughout year, slight Q4 increase
      inflows: [0.9, 0.9, 1.0, 1.0, 1.0, 1.1, 1.0, 1.0, 1.1, 1.1, 1.2, 0.8],
      weekdayFactors: [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.2], // Mon-Sun (weekends low)
      // Major material purchases quarterly
      outflows: [1.4, 0.8, 0.8, 1.0, 1.4, 0.8, 0.8, 1.0, 1.4, 0.8, 0.8, 1.0]
    },
    averageDSO: 45, // Longer payment terms for manufacturing
    averageDPO: 30, 
    dailyVariability: 0.08, // Lower daily variation
    bigEvents: [
      { name: 'Quarterly Material Purchase', month: 1, day: 15, inflowFactor: 1.0, outflowFactor: 2.5 },
      { name: 'Quarterly Material Purchase', month: 4, day: 15, inflowFactor: 1.0, outflowFactor: 2.5 },
      { name: 'Quarterly Material Purchase', month: 7, day: 15, inflowFactor: 1.0, outflowFactor: 2.5 },
      { name: 'Quarterly Material Purchase', month: 10, day: 15, inflowFactor: 1.0, outflowFactor: 2.5 }
    ],
    transactionCategories: {
      inflows: [
        { name: 'Product Sales', weight: 0.6 },
        { name: 'Contract Fulfillment', weight: 0.25 },
        { name: 'Service Agreements', weight: 0.1 },
        { name: 'Spare Parts', weight: 0.05 }
      ],
      outflows: [
        { name: 'Raw Materials', weight: 0.35 },
        { name: 'Payroll', weight: 0.25 },
        { name: 'Equipment Maintenance', weight: 0.1 },
        { name: 'Utilities', weight: 0.08 },
        { name: 'Facility Costs', weight: 0.1 },
        { name: 'Transportation', weight: 0.07 },
        { name: 'Insurance', weight: 0.03 },
        { name: 'Taxes', weight: 0.02 }
      ]
    }
  },
  saas: {
    name: 'Software/SaaS',
    seasonalityFactors: {
      // Fairly consistent monthly subscriptions, slight year-end increase
      inflows: [1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.0, 1.0, 1.0, 1.0, 1.1, 1.3],
      weekdayFactors: [1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.9], // Consistent across weekdays
      // Salary spikes on 1st and 15th, quarterly cloud costs
      outflows: [1.1, 0.8, 0.8, 1.2, 0.8, 0.8, 0.8, 1.2, 0.8, 0.8, 0.8, 1.2]
    },
    averageDSO: 10, // Very fast payment (credit cards, automatic payments)
    averageDPO: 15, // Fast payment to vendors
    dailyVariability: 0.05, // Very consistent
    bigEvents: [
      { name: 'Annual Subscriptions Renewal', month: 1, day: 5, inflowFactor: 2.0, outflowFactor: 1.0 },
      { name: 'Quarterly AWS/Cloud Costs', month: 1, day: 2, inflowFactor: 1.0, outflowFactor: 1.8 },
      { name: 'Quarterly AWS/Cloud Costs', month: 4, day: 2, inflowFactor: 1.0, outflowFactor: 1.8 },
      { name: 'Quarterly AWS/Cloud Costs', month: 7, day: 2, inflowFactor: 1.0, outflowFactor: 1.8 },
      { name: 'Quarterly AWS/Cloud Costs', month: 10, day: 2, inflowFactor: 1.0, outflowFactor: 1.8 }
    ],
    transactionCategories: {
      inflows: [
        { name: 'Monthly Subscriptions', weight: 0.5 },
        { name: 'Annual Subscriptions', weight: 0.2 },
        { name: 'Implementation Fees', weight: 0.1 },
        { name: 'Professional Services', weight: 0.1 },
        { name: 'Add-on Features', weight: 0.1 }
      ],
      outflows: [
        { name: 'Payroll', weight: 0.5 },
        { name: 'Cloud Infrastructure', weight: 0.15 },
        { name: 'Marketing', weight: 0.1 },
        { name: 'Office Space', weight: 0.07 },
        { name: 'Software Licenses', weight: 0.06 },
        { name: 'Customer Support', weight: 0.05 },
        { name: 'Professional Services', weight: 0.04 },
        { name: 'Insurance', weight: 0.03 }
      ]
    }
  }
};

// Customer/Vendor data for transaction generation
const generateBusinessPartners = (industry: string) => {
  const customerCount = 15 + Math.floor(Math.random() * 20); // 15-35 customers
  const vendorCount = 8 + Math.floor(Math.random() * 12); // 8-20 vendors
  
  const customers = [];
  for (let i = 0; i < customerCount; i++) {
    const size = Math.random();
    customers.push({
      id: `cust-${i+1}`,
      name: `Customer ${i+1}`,
      tier: size > 0.8 ? 'large' : size > 0.5 ? 'medium' : 'small',
      share: 0, // To be calculated based on tier
      paymentTerms: size > 0.8 ? 45 : size > 0.5 ? 30 : 15, // Days
      paymentReliability: Math.random() > 0.8 ? 'late' : Math.random() > 0.3 ? 'on-time' : 'early'
    });
  }
  
  // Calculate share based on tier
  let totalWeight = 0;
  customers.forEach(customer => {
    let weight = customer.tier === 'large' ? 5 : customer.tier === 'medium' ? 2 : 1;
    totalWeight += weight;
  });
  
  customers.forEach(customer => {
    let weight = customer.tier === 'large' ? 5 : customer.tier === 'medium' ? 2 : 1;
    customer.share = weight / totalWeight;
  });
  
  // Generate vendors
  const vendors = [];
  for (let i = 0; i < vendorCount; i++) {
    const importance = Math.random();
    vendors.push({
      id: `vendor-${i+1}`,
      name: `Vendor ${i+1}`,
      importance: importance > 0.8 ? 'critical' : importance > 0.5 ? 'important' : 'standard',
      share: 0, // To be calculated based on importance
      paymentTerms: importance > 0.8 ? 15 : importance > 0.5 ? 30 : 45, // Days
      category: getRandomVendorCategory(industry)
    });
  }
  
  // Calculate share based on importance
  totalWeight = 0;
  vendors.forEach(vendor => {
    let weight = vendor.importance === 'critical' ? 8 : vendor.importance === 'important' ? 3 : 1;
    totalWeight += weight;
  });
  
  vendors.forEach(vendor => {
    let weight = vendor.importance === 'critical' ? 8 : vendor.importance === 'important' ? 3 : 1;
    vendor.share = weight / totalWeight;
  });
  
  return { customers, vendors };
};

function getRandomVendorCategory(industry: string) {
  const categories = INDUSTRY_PATTERNS[industry as keyof typeof INDUSTRY_PATTERNS]?.transactionCategories.outflows || [];
  return categories[Math.floor(Math.random() * categories.length)]?.name || 'General';
}

// Generate recurring transactions for a given date range
const generateRecurringTransactions = (
  startDate: Date,
  endDate: Date,
  industry: string,
  industryPattern: any,
  businessPartners: any
) => {
  const transactions = [];
  const currentDate = new Date(startDate);
  
  // Generate payroll transactions (twice a month)
  while (currentDate <= endDate) {
    // Bimonthly payroll (15th and last day of month)
    if (currentDate.getDate() === 15 || 
        currentDate.getDate() === new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) {
      
      // Get the appropriate transaction category
      const payrollCategory = industryPattern.transactionCategories.outflows.find((cat: any) => cat.name === 'Payroll');
      const payrollShare = payrollCategory?.weight || 0.25;
      
      // Base payroll amount (scaled by industry)
      const basePayroll = industry === 'saas' ? 125000 : industry === 'manufacturing' ? 95000 : 65000;
      
      // Add some variability
      const payrollAmount = Math.round(basePayroll * (0.9 + Math.random() * 0.2));
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: 'Payroll',
        amount: payrollAmount,
        entity: 'Employees',
        isRecurring: true,
        notes: currentDate.getDate() === 15 ? 'Mid-month payroll' : 'End-month payroll'
      });
    }
    
    // Rent (1st of month)
    if (currentDate.getDate() === 1) {
      const rentCategory = industryPattern.transactionCategories.outflows.find((cat: any) => 
        cat.name === 'Rent' || cat.name === 'Office Space' || cat.name === 'Facility Costs'
      );
      const rentShare = rentCategory?.weight || 0.1;
      
      // Base rent amount (scaled by industry)
      const baseRent = industry === 'saas' ? 30000 : industry === 'manufacturing' ? 45000 : 25000;
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: rentCategory?.name || 'Rent',
        amount: baseRent,
        entity: 'Property Management',
        isRecurring: true,
        notes: 'Monthly lease payment'
      });
    }
    
    // Utility bills (10th of month)
    if (currentDate.getDate() === 10) {
      const utilitiesCategory = industryPattern.transactionCategories.outflows.find((cat: any) => cat.name === 'Utilities');
      const utilitiesShare = utilitiesCategory?.weight || 0.05;
      
      // Base utilities amount (scaled by industry)
      const baseUtilities = industry === 'manufacturing' ? 18000 : industry === 'retail' ? 12000 : 8000;
      
      // Add seasonal variability (higher in summer and winter)
      const month = currentDate.getMonth();
      const seasonalFactor = (month <= 1 || month >= 10) ? 1.3 : // Winter
                             (month >= 5 && month <= 8) ? 1.2 : // Summer 
                             1.0; // Spring/Fall
      
      const utilitiesAmount = Math.round(baseUtilities * seasonalFactor * (0.9 + Math.random() * 0.2));
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: 'Utilities',
        amount: utilitiesAmount,
        entity: 'Utility Providers',
        isRecurring: true,
        notes: 'Monthly utilities cost'
      });
    }
    
    // Software subscriptions (5th of month) - more relevant for SaaS and retail
    if ((industry === 'saas' || industry === 'retail') && currentDate.getDate() === 5) {
      const subscriptionCategory = industryPattern.transactionCategories.outflows.find((cat: any) => 
        cat.name === 'Software Licenses' || cat.name === 'Software'
      );
      
      const baseSubscription = industry === 'saas' ? 8000 : 5000;
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: subscriptionCategory?.name || 'Software Subscriptions',
        amount: baseSubscription,
        entity: 'Various Software Vendors',
        isRecurring: true,
        notes: 'Monthly software licenses and services'
      });
    }
    
    // Insurance payments (quarterly) - 15th of first month each quarter
    if (currentDate.getDate() === 15 && [0, 3, 6, 9].includes(currentDate.getMonth())) {
      const insuranceCategory = industryPattern.transactionCategories.outflows.find((cat: any) => cat.name === 'Insurance');
      
      const baseInsurance = industry === 'manufacturing' ? 15000 : industry === 'retail' ? 12000 : 9000;
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: 'Insurance',
        amount: baseInsurance,
        entity: 'Insurance Provider',
        isRecurring: true,
        notes: 'Quarterly insurance premium'
      });
    }
    
    // SaaS specific: Cloud infrastructure costs (3rd of month)
    if (industry === 'saas' && currentDate.getDate() === 3) {
      const cloudCategory = industryPattern.transactionCategories.outflows.find((cat: any) => cat.name === 'Cloud Infrastructure');
      
      const baseCloud = 22000;
      // Add some growth over time to simulate increased usage
      const monthsFromStart = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                              (currentDate.getMonth() - startDate.getMonth());
      const growthFactor = 1 + (monthsFromStart * 0.01); // 1% growth per month
      
      const cloudAmount = Math.round(baseCloud * growthFactor * (0.9 + Math.random() * 0.3));
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: 'Cloud Infrastructure',
        amount: cloudAmount,
        entity: 'Cloud Provider',
        isRecurring: true,
        notes: 'Monthly cloud computing costs'
      });
    }
    
    // Manufacturing specific: Raw materials (twice a month)
    if (industry === 'manufacturing' && (currentDate.getDate() === 5 || currentDate.getDate() === 20)) {
      const materialsCategory = industryPattern.transactionCategories.outflows.find((cat: any) => cat.name === 'Raw Materials');
      
      const baseMaterials = 35000;
      // Add seasonal variability based on inflow trends
      const month = currentDate.getMonth();
      const seasonalFactor = industryPattern.seasonalityFactors.inflows[month];
      
      const materialsAmount = Math.round(baseMaterials * seasonalFactor * (0.9 + Math.random() * 0.2));
      
      // Assign to a random vendor with appropriate category
      const materialVendors = businessPartners.vendors.filter((v: any) => 
        v.category === 'Raw Materials' || v.importance === 'critical'
      );
      const vendor = materialVendors[Math.floor(Math.random() * materialVendors.length)] || 
                    { name: 'Primary Supplier', importance: 'critical' };
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: 'Raw Materials',
        amount: materialsAmount,
        entity: vendor.name,
        entityImportance: vendor.importance,
        isRecurring: true,
        notes: currentDate.getDate() === 5 ? 'Early month materials order' : 'Late month materials order'
      });
    }
    
    // Retail specific: Inventory purchases (weekly)
    if (industry === 'retail' && currentDate.getDay() === 2) { // Every Tuesday
      const inventoryCategory = industryPattern.transactionCategories.outflows.find((cat: any) => cat.name === 'Inventory Purchase');
      
      const baseInventory = 25000;
      // Add seasonal variability based on inflow trends
      const month = currentDate.getMonth();
      const seasonalFactor = industryPattern.seasonalityFactors.inflows[month];
      
      // Stronger seasonal variability for retail inventory
      const adjustedFactor = 0.7 + (seasonalFactor * 0.3);
      
      const inventoryAmount = Math.round(baseInventory * adjustedFactor * (0.85 + Math.random() * 0.3));
      
      // Assign to a random vendor with appropriate category
      const inventoryVendors = businessPartners.vendors.filter((v: any) => 
        v.category === 'Inventory Purchase' || v.importance === 'critical'
      );
      const vendor = inventoryVendors[Math.floor(Math.random() * inventoryVendors.length)] || 
                    { name: 'Inventory Supplier', importance: 'important' };
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: 'Inventory Purchase',
        amount: inventoryAmount,
        entity: vendor.name,
        entityImportance: vendor.importance,
        isRecurring: true,
        notes: 'Weekly inventory restock'
      });
    }
    
    // Marketing costs (20th of month)
    if (currentDate.getDate() === 20) {
      const marketingCategory = industryPattern.transactionCategories.outflows.find((cat: any) => cat.name === 'Marketing');
      const marketingShare = marketingCategory?.weight || 0.08;
      
      // Base marketing amount (scaled by industry)
      const baseMarketing = industry === 'saas' ? 20000 : industry === 'retail' ? 18000 : 12000;
      
      // Marketing spend increases before peak seasons
      const month = currentDate.getMonth();
      const nextMonth = (month + 1) % 12;
      const seasonalFactor = industryPattern.seasonalityFactors.inflows[nextMonth] > 1.2 ? 1.5 : 1.0;
      
      const marketingAmount = Math.round(baseMarketing * seasonalFactor * (0.8 + Math.random() * 0.4));
      
      transactions.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        type: 'outflow',
        category: 'Marketing',
        amount: marketingAmount,
        entity: 'Marketing Agencies',
        isRecurring: true,
        notes: seasonalFactor > 1.0 ? 'Increased marketing for upcoming peak season' : 'Regular marketing spend'
      });
    }
    
    // Advance to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return transactions;
};

// Generate customer transaction data (sales/inflows)
const generateCustomerTransactions = (
  startDate: Date,
  endDate: Date,
  industry: string,
  industryPattern: any,
  businessPartners: any
) => {
  const transactions = [];
  const currentDate = new Date(startDate);
  
  // Calculate base daily inflow (scaled by industry)
  const baseDailyInflow = industry === 'saas' ? 10000 : industry === 'manufacturing' ? 25000 : 15000;
  
  while (currentDate <= endDate) {
    // Get the month and day of week
    const month = currentDate.getMonth();
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Apply seasonal factors
    const monthlyFactor = industryPattern.seasonalityFactors.inflows[month];
    const weekdayFactor = industryPattern.seasonalityFactors.weekdayFactors[dayOfWeek];
    
    // Check for big events
    let eventFactor = 1;
    let eventName = null;
    industryPattern.bigEvents.forEach((event: any) => {
      if (event.month === month + 1 && event.day === currentDate.getDate()) {
        eventFactor = event.inflowFactor;
        eventName = event.name;
      }
    });
    
    // Calculate daily inflow with seasonal adjustments and randomness
    const dailyVariability = 1 + (Math.random() * 2 - 1) * industryPattern.dailyVariability;
    const dailyInflow = Math.round(
      baseDailyInflow * monthlyFactor * weekdayFactor * eventFactor * dailyVariability
    );
    
    // Skip days with very low activity
    if (dailyInflow > baseDailyInflow * 0.1) {
      // How many transactions for this day?
      let transactionsCount;
      if (industry === 'retail') {
        // Retail has many small transactions
        transactionsCount = Math.floor(3 + Math.random() * 5);
      } else if (industry === 'manufacturing') {
        // Manufacturing has fewer, larger transactions
        transactionsCount = Math.floor(1 + Math.random() * 3);
      } else {
        // SaaS has a moderate number of transactions
        transactionsCount = Math.floor(2 + Math.random() * 3);
      }
      
      // Distribute the daily inflow across transactions
      let remainingInflow = dailyInflow;
      for (let i = 0; i < transactionsCount; i++) {
        // Last transaction gets the remainder
        const isLastTransaction = i === transactionsCount - 1;
        
        // Calculate transaction amount
        let transactionAmount;
        if (isLastTransaction) {
          transactionAmount = remainingInflow;
        } else {
          // Random share of remaining inflow (more variation in retail)
          const sharePercentage = industry === 'retail' 
            ? 0.1 + Math.random() * 0.4  // 10-50% for retail
            : 0.2 + Math.random() * 0.6; // 20-80% for others
          
          transactionAmount = Math.round(remainingInflow * sharePercentage);
          remainingInflow -= transactionAmount;
        }
        
        // Skip very small transactions
        if (transactionAmount < 100) continue;
        
        // Assign to a customer based on their tier/share
        let customer;
        if (eventName && Math.random() > 0.5) {
          // During events, more likely to get new or smaller customers
          const smallCustomers = businessPartners.customers.filter((c: any) => c.tier === 'small');
          customer = smallCustomers[Math.floor(Math.random() * smallCustomers.length)];
        } else {
          // Weighted random selection based on customer share
          const rand = Math.random();
          let cumulativeShare = 0;
          
          customer = businessPartners.customers.find((c: any) => {
            cumulativeShare += c.share;
            return rand <= cumulativeShare;
          }) || businessPartners.customers[0]; // Fallback
        }
        
        // Select transaction category
        const categories = industryPattern.transactionCategories.inflows;
        let categoryName;
        
        if (eventName) {
          // During events, use specific categories
          if (industry === 'retail' && eventName.includes('Friday') || eventName.includes('Christmas')) {
            categoryName = 'In-store Sales';
          } else if (industry === 'manufacturing' && eventName.includes('Purchase')) {
            categoryName = 'Product Sales';
          } else if (industry === 'saas' && eventName.includes('Subscriptions')) {
            categoryName = 'Annual Subscriptions';
          } else {
            // Random category
            const category = categories[Math.floor(Math.random() * categories.length)];
            categoryName = category.name;
          }
        } else {
          // Weighted random selection of category
          const rand = Math.random();
          let cumulativeWeight = 0;
          
          for (const category of categories) {
            cumulativeWeight += Math.abs(category.weight); // Use absolute value to handle negative weights
            if (rand <= cumulativeWeight) {
              categoryName = category.name;
              break;
            }
          }
          
          // Fallback
          if (!categoryName) {
            categoryName = categories[0]?.name || 'Sales';
          }
        }
        
        // Handle negative categories (like refunds)
        const categoryObj = categories.find((c: any) => c.name === categoryName);
        let isNegative = false;
        if (categoryObj && categoryObj.weight < 0) {
          isNegative = true;
          transactionAmount = -transactionAmount;
        }
        
        transactions.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          type: isNegative ? 'outflow' : 'inflow',
          category: categoryName,
          amount: Math.abs(transactionAmount),
          entity: customer.name,
          entityTier: customer.tier,
          paymentTerms: customer.paymentTerms,
          reliability: customer.paymentReliability,
          ...(eventName && { event: eventName }),
          notes: eventName ? `${eventName} related transaction` : `Regular ${categoryName}`
        });
      }
    }
    
    // Advance to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return transactions;
};

// Process transactions and apply payment terms to account for delayed payments
const applyPaymentTerms = (transactions: any[]) => {
  const processedTransactions = [];
  
  transactions.forEach(transaction => {
    const transactionCopy = { ...transaction };
    
    // For customer inflows, apply payment terms and reliability
    if (transaction.type === 'inflow' && transaction.paymentTerms) {
      // Calculate actual payment date based on terms and reliability
      const originalDate = new Date(transaction.date);
      let delayDays = transaction.paymentTerms; // Default to the terms
      
      // Adjust based on payment reliability
      if (transaction.reliability === 'early') {
        delayDays = Math.max(0, delayDays - Math.round(5 + Math.random() * 5)); // 5-10 days early
      } else if (transaction.reliability === 'late') {
        delayDays += Math.round(5 + Math.random() * 10); // 5-15 days late
      }
      
      const paymentDate = new Date(originalDate);
      paymentDate.setDate(originalDate.getDate() + delayDays);
      
      // Update transaction date
      transactionCopy.invoiceDate = transaction.date;
      transactionCopy.date = format(paymentDate, 'yyyy-MM-dd');
      transactionCopy.actualPaymentTerms = delayDays;
    }
    
    processedTransactions.push(transactionCopy);
  });
  
  return processedTransactions;
};

// Default to manufacturing industry unless specified
const DEFAULT_INDUSTRY = 'manufacturing';

export function generateHistoricalData(industry = DEFAULT_INDUSTRY) {
  // Generate 90 days of historical data
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  const endDate = new Date();
  
  const industryPattern = INDUSTRY_PATTERNS[industry as keyof typeof INDUSTRY_PATTERNS] || 
                          INDUSTRY_PATTERNS[DEFAULT_INDUSTRY];
  
  // Generate business partners (customers and vendors)
  const businessPartners = generateBusinessPartners(industry);
  
  // Generate transactions
  const recurringTransactions = generateRecurringTransactions(
    startDate, 
    endDate, 
    industry,
    industryPattern,
    businessPartners
  );
  
  const customerTransactions = generateCustomerTransactions(
    startDate,
    endDate,
    industry,
    industryPattern,
    businessPartners
  );
  
  // Combine and sort all transactions
  let allTransactions = [...recurringTransactions, ...customerTransactions];
  
  // Apply payment terms to account for delayed payments
  allTransactions = applyPaymentTerms(allTransactions);
  
  // Sort by date
  allTransactions.sort((a, b) => a.date.localeCompare(b.date));
  
  // Now aggregate by day for cash flow analysis
  const dailyData = [];
  let balance = 250000; // Starting balance
  
  // Group transactions by date
  const transactionsByDate: Record<string, any[]> = {};
  allTransactions.forEach(transaction => {
    if (!transactionsByDate[transaction.date]) {
      transactionsByDate[transaction.date] = [];
    }
    transactionsByDate[transaction.date].push(transaction);
  });
  
  // Create daily entries from start to end date
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const dayTransactions = transactionsByDate[dateString] || [];
    
    // Calculate inflows and outflows
    let inflows = 0;
    let outflows = 0;
    
    dayTransactions.forEach(transaction => {
      if (transaction.type === 'inflow') {
        inflows += transaction.amount;
      } else {
        outflows += transaction.amount;
      }
    });
    
    // Update balance
    balance = balance + inflows - outflows;
    
    dailyData.push({
      date: dateString,
      inflows: inflows,
      outflows: outflows,
      balance: Math.round(balance),
      transactions: dayTransactions
    });
    
    // Next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate KPIs
  // Days Sales Outstanding (average time to collect payment)
  let totalDSO = 0;
  let dsoCount = 0;
  allTransactions.forEach(transaction => {
    if (transaction.type === 'inflow' && transaction.invoiceDate) {
      const invoiceDate = new Date(transaction.invoiceDate);
      const paymentDate = new Date(transaction.date);
      const daysToPayment = Math.round((paymentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      totalDSO += daysToPayment;
      dsoCount++;
    }
  });
  
  const avgDSO = dsoCount > 0 ? totalDSO / dsoCount : industryPattern.averageDSO;
  
  // Days Payable Outstanding
  const avgDPO = industryPattern.averageDPO + (Math.random() * 8 - 4);
  
  return {
    dailyData,
    transactions: allTransactions,
    businessPartners,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    startingBalance: 250000,
    endingBalance: Math.round(balance),
    industry: industryPattern.name,
    kpis: {
      dso: avgDSO,
      dpo: avgDPO,
      cashConversionCycle: avgDSO + 30 - avgDPO // Adding 30 days for inventory
    }
  };
}

export function generateForecastData(historicalData: any, forecastLength = 90) {
  // Generate forecast data
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + forecastLength - 1);
  
  // Determine industry pattern based on historical data
  let industryPattern;
  if (historicalData.industry) {
    const industryKey = Object.keys(INDUSTRY_PATTERNS).find(
      key => INDUSTRY_PATTERNS[key as keyof typeof INDUSTRY_PATTERNS].name === historicalData.industry
    );
    industryPattern = industryKey 
      ? INDUSTRY_PATTERNS[industryKey as keyof typeof INDUSTRY_PATTERNS]
      : INDUSTRY_PATTERNS[DEFAULT_INDUSTRY];
  } else {
    industryPattern = INDUSTRY_PATTERNS[DEFAULT_INDUSTRY];
  }
  
  // Start with current balance
  let balance = historicalData.endingBalance;
  
  // Business partners should come from historical data if available
  const businessPartners = historicalData.businessPartners || 
                          generateBusinessPartners(Object.keys(INDUSTRY_PATTERNS).find(
                            key => INDUSTRY_PATTERNS[key as keyof typeof INDUSTRY_PATTERNS].name === historicalData.industry
                          ) || DEFAULT_INDUSTRY);
  
  // Generate transactions for forecast period
  const recurringTransactions = generateRecurringTransactions(
    startDate,
    endDate,
    Object.keys(INDUSTRY_PATTERNS).find(
      key => INDUSTRY_PATTERNS[key as keyof typeof INDUSTRY_PATTERNS].name === historicalData.industry
    ) || DEFAULT_INDUSTRY,
    industryPattern,
    businessPartners
  );
  
  const customerTransactions = generateCustomerTransactions(
    startDate,
    endDate,
    Object.keys(INDUSTRY_PATTERNS).find(
      key => INDUSTRY_PATTERNS[key as keyof typeof INDUSTRY_PATTERNS].name === historicalData.industry
    ) || DEFAULT_INDUSTRY,
    industryPattern,
    businessPartners
  );
  
  // Combine and sort transactions
  let allTransactions = [...recurringTransactions, ...customerTransactions];
  
  // Apply payment terms for more realistic forecast
  allTransactions = applyPaymentTerms(allTransactions);
  
  // Sort by date
  allTransactions.sort((a, b) => a.date.localeCompare(b.date));
  
  // Now aggregate by day for cash flow analysis
  const dailyForecasts = [];
  
  // Group transactions by date
  const transactionsByDate: Record<string, any[]> = {};
  allTransactions.forEach(transaction => {
    if (!transactionsByDate[transaction.date]) {
      transactionsByDate[transaction.date] = [];
    }
    transactionsByDate[transaction.date].push(transaction);
  });
  
  // Create daily entries from start to end date
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const dayTransactions = transactionsByDate[dateString] || [];
    
    // Calculate inflows and outflows
    let inflows = 0;
    let outflows = 0;
    
    dayTransactions.forEach(transaction => {
      if (transaction.type === 'inflow') {
        inflows += transaction.amount;
      } else {
        outflows += transaction.amount;
      }
    });
    
    // Add increasing variance for future predictions
    const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const varianceFactor = 1 + (daysSinceStart / forecastLength) * 0.8;
    
    // Apply variance to inflows and outflows
    inflows *= (1 + (Math.random() * 2 - 1) * industryPattern.dailyVariability * varianceFactor);
    outflows *= (1 + (Math.random() * 2 - 1) * industryPattern.dailyVariability * varianceFactor);
    
    // Round values
    inflows = Math.round(inflows);
    outflows = Math.round(outflows);
    
    // Update balance
    balance = balance + inflows - outflows;
    
    // Calculate confidence level (decreases as we go further in time)
    const confidence = Math.round(95 - (daysSinceStart / forecastLength) * 45);
    
    dailyForecasts.push({
      date: dateString,
      inflows: inflows,
      outflows: outflows,
      balance: Math.round(balance),
      transactions: dayTransactions,
      confidence: confidence
    });
    
    // Next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Generate monthly aggregates
  const monthlyForecasts = [];
  
  // Get month names
  const monthDate = new Date();
  const months = [];
  for (let i = 0; i < 3; i++) {
    const month = new Date(monthDate);
    month.setMonth(monthDate.getMonth() + i);
    months.push(month.toLocaleString('default', { month: 'short', year: 'numeric' }));
  }
  
  // Group by month and calculate totals
  for (let i = 0; i < 3; i++) {
    const daysInMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + i + 1,
      0
    ).getDate();
    
    const monthStart = i === 0 ? 0 : dailyForecasts.findIndex(forecast => {
      const forecastDate = new Date(forecast.date);
      return forecastDate.getMonth() === (monthDate.getMonth() + i) % 12 &&
             forecastDate.getDate() === 1;
    });
    
    if (monthStart === -1) continue;
    
    const monthEnd = Math.min(
      monthStart + daysInMonth - 1,
      dailyForecasts.length - 1
    );
    
    const monthData = dailyForecasts.slice(monthStart, monthEnd + 1);
    
    if (monthData.length === 0) continue;
    
    const totalInflows = monthData.reduce((sum, day) => sum + day.inflows, 0);
    const totalOutflows = monthData.reduce((sum, day) => sum + day.outflows, 0);
    const endBalance = monthData[monthData.length - 1].balance;
    const avgConfidence = Math.round(
      monthData.reduce((sum, day) => sum + day.confidence, 0) / monthData.length
    );
    
    monthlyForecasts.push({
      month: months[i],
      inflows: totalInflows,
      outflows: totalOutflows,
      balance: endBalance,
      confidence: avgConfidence
    });
  }
  
  // Generate KPIs
  const kpis = {
    dso: historicalData.kpis?.dso || (industryPattern.averageDSO + Math.random() * 10 - 5),
    dpo: historicalData.kpis?.dpo || (industryPattern.averageDPO + Math.random() * 8 - 4),
    burnRate: Math.round(monthlyForecasts[0].outflows / 30),
    cashConversionCycle: historicalData.kpis?.cashConversionCycle || 60 + Math.random() * 15 - 7,
    revenueGrowth: 0.08 + Math.random() * 0.04 - 0.02,
  };
  
  return {
    dailyForecasts,
    monthlyForecasts,
    transactions: allTransactions,
    businessPartners,
    kpis,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    industry: historicalData.industry || industryPattern.name
  };
}

// Function to get detailed transaction data from historical or forecast data
export function getTransactionDetails(data: any, startDate?: string, endDate?: string) {
  let transactions = [];
  
  // Extract transactions from daily data
  if (data.dailyData) {
    // Historical data
    data.dailyData.forEach((day: any) => {
      if (day.transactions) {
        transactions = [...transactions, ...day.transactions];
      }
    });
  } else if (data.dailyForecasts) {
    // Forecast data
    data.dailyForecasts.forEach((day: any) => {
      if (day.transactions) {
        transactions = [...transactions, ...day.transactions];
      }
    });
  } else if (data.transactions) {
    // Direct transactions array
    transactions = data.transactions;
  }
  
  // Filter by date range if provided
  if (startDate && endDate) {
    transactions = transactions.filter((t: any) => 
      t.date >= startDate && t.date <= endDate
    );
  }
  
  // Sort by date
  transactions.sort((a: any, b: any) => a.date.localeCompare(b.date));
  
  return transactions;
}

// Function to get top customers or vendors
export function getTopEntities(data: any, entityType: 'customer' | 'vendor', count: number = 5) {
  const transactions = getTransactionDetails(data);
  
  // Group by entity and calculate total transaction amount
  const entityMap: Record<string, { name: string; total: number; tier?: string; importance?: string }> = {};
  
  transactions.forEach((t: any) => {
    if ((entityType === 'customer' && t.type === 'inflow') || 
        (entityType === 'vendor' && t.type === 'outflow')) {
      
      if (!entityMap[t.entity]) {
        entityMap[t.entity] = { 
          name: t.entity, 
          total: 0,
          ...(t.entityTier && { tier: t.entityTier }),
          ...(t.entityImportance && { importance: t.entityImportance })
        };
      }
      
      entityMap[t.entity].total += t.amount;
    }
  });
  
  // Convert to array and sort
  const entities = Object.values(entityMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, count);
  
  return entities;
}

// Function to get category breakdown
export function getCategoryBreakdown(data: any, type: 'inflow' | 'outflow') {
  const transactions = getTransactionDetails(data);
  
  // Group by category
  const categoryMap: Record<string, { name: string; total: number }> = {};
  
  transactions.forEach((t: any) => {
    if (t.type === type) {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { name: t.category, total: 0 };
      }
      
      categoryMap[t.category].total += t.amount;
    }
  });
  
  // Convert to array and sort
  const categories = Object.values(categoryMap)
    .sort((a, b) => b.total - a.total);
  
  return categories;
}
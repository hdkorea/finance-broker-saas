const calculateLoanRecommendations = (clientInfo, banks) => {
    const recommendations = [];
  
    for (const bank of banks) {
      for (const policy of bank.policies) {
        const loanAmount = calculateLoanAmount(clientInfo, policy);
        const interestRate = calculateInterestRate(clientInfo, policy);
        const term = calculateLoanTerm(clientInfo, policy);
  
        if (loanAmount > 0) {
          recommendations.push({
            bankName: bank.name,
            productName: policy.name,
            loanAmount,
            interestRate,
            term,
          });
        }
      }
    }
  
    return recommendations.sort((a, b) => a.interestRate - b.interestRate);
  };
  
  const calculateLoanAmount = (clientInfo, policy) => {
    // Implement loan amount calculation based on client info and policy
    // This is a simplified example
    const maxLoanToIncome = 5;
    return Math.min(clientInfo.income * maxLoanToIncome, policy.maxLoanAmount || Infinity);
  };
  
  const calculateInterestRate = (clientInfo, policy) => {
    // Implement interest rate calculation based on client info and policy
    // This is a simplified example
    const baseRate = policy.baseInterestRate || 5;
    const riskAdjustment = calculateRiskAdjustment(clientInfo);
    return baseRate + riskAdjustment;
  };
  
  const calculateLoanTerm = (clientInfo, policy) => {
    // Implement loan term calculation based on client info and policy
    // This is a simplified example
    return policy.maxLoanTerm || 30;
  };
  
  const calculateRiskAdjustment = (clientInfo) => {
    // Implement risk adjustment calculation based on client info
    // This is a simplified example
    let risk = 0;
    if (clientInfo.income < 50000) risk += 1;
    if (clientInfo.assets < 100000) risk += 0.5;
    return risk;
  };
  
  module.exports = {
    calculateLoanRecommendations,
  };
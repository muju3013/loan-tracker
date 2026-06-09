import { Loan, EmiInstallment } from "../types";

export interface AIRecommendation {
  id: string;
  type: "positive" | "warning" | "info" | "action";
  message: string;
}

export class AIAdvisorService {
  static analyze(loans: Loan[], emiSchedule: EmiInstallment[], income = 50000): { score: number; text: string; recommendations: AIRecommendation[] } {
    let score = 100;
    const recommendations: AIRecommendation[] = [];

    const activeLoans = loans.filter(l => l.isActive);
    if (activeLoans.length === 0) {
      return { score: 100, text: "Excellent", recommendations: [{ id: "1", type: "info", message: "You have no active loans. Great financial health!" }] };
    }

    let totalMonthlyEmi = 0;
    let highestInterestLoan = activeLoans[0];

    activeLoans.forEach(loan => {
      totalMonthlyEmi += loan.emiAmount;
      if (loan.annualInterestRate > highestInterestLoan.annualInterestRate) {
        highestInterestLoan = loan;
      }
    });

    const emiBurden = (totalMonthlyEmi / income) * 100;

    if (emiBurden > 40) {
      score -= 20;
      recommendations.push({
        id: "r1",
        type: "warning",
        message: `Your total monthly EMI burden is ${emiBurden.toFixed(0)}% of your monthly income. Consider reducing high-interest debt.`
      });
    } else {
      recommendations.push({
        id: "r2",
        type: "positive",
        message: `Your EMI burden is healthy at ${emiBurden.toFixed(0)}%. Keep up the good financial habits!`
      });
    }

    if (highestInterestLoan && highestInterestLoan.annualInterestRate > 15) {
      score -= 10;
      recommendations.push({
        id: "r3",
        type: "action",
        message: `${highestInterestLoan.loanName} loan ka interest rate sabse zyada hai (${highestInterestLoan.annualInterestRate}%). Is loan ko pehle close karna financially beneficial ho sakta hai.`
      });
    }

    // Identify pre-payment savings opportunity
    if (activeLoans.length > 0) {
      const targetLoan = activeLoans[0];
      const extraPayment = 2000;
      // Rough estimation for demo purposes
      const estimatedMonthsSaved = Math.ceil(extraPayment / (targetLoan.emiAmount * 0.2)); 
      
      recommendations.push({
        id: "r4",
        type: "info",
        message: `Agar aap ${targetLoan.loanName} loan par ₹${extraPayment} extra payment karte hain to loan tenure approximately ${estimatedMonthsSaved} months kam ho sakti hai.`
      });
    }

    const overdueCount = emiSchedule.filter(e => e.status === "overdue").length;
    if (overdueCount > 0) {
      score -= Math.min(30, overdueCount * 10);
      recommendations.push({
        id: "r5",
        type: "warning",
        message: `You have ${overdueCount} overdue payments. Clear them immediately to avoid penalties and credit score damage.`
      });
    } else {
      recommendations.push({
        id: "r6",
        type: "positive",
        message: `Excellent repayment track record. Based on your pattern, you can save approximately ₹1,200 in interest through pre-payment.`
      });
    }

    let text = "Good";
    if (score >= 90) text = "Excellent";
    else if (score >= 70) text = "Good";
    else if (score >= 50) text = "Fair";
    else text = "Poor";

    return { score: Math.max(0, score), text, recommendations };
  }
}

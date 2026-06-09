export type EmiStatus = "pending" | "paid" | "overdue" | "partial";
export type AdjustmentReason = "none" | "weekend" | "holiday" | "weekend_and_holiday";

export interface Holiday {
  id: string;
  holidayDate: string; // YYYY-MM-DD
  name: string;
}

export interface Loan {
  id: string;
  loanName: string;
  principalAmount: number;
  annualInterestRate: number;
  loanStartDate: string;
  tenureMonths: number;
  emiAmount: number;
  totalInterest: number;
  totalPayable: number;
  isActive: boolean;
  createdAt: string;
}

export interface EmiInstallment {
  id: string;
  loanId: string;
  installmentNumber: number;
  scheduledDueDate: string;
  effectiveDueDate: string;
  adjustmentReason: AdjustmentReason;
  adjustmentNote: string | null;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  openingBalance: number;
  closingBalance: number;
  status: EmiStatus;
  amountPaid: number;
  paymentDate: string | null;
}

export interface AppData {
  loans: Loan[];
  emiSchedule: EmiInstallment[];
  holidays: Holiday[];
}

export type NotificationType = "reminder_7d" | "reminder_3d" | "due_today" | "overdue";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedLoanId: string;
  relatedEmiId: string;
  isRead: boolean;
  createdAt: string; // ISO string or timestamp
}

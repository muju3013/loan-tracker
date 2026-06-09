import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { AppData } from '../types';

export class ExportService {
  static generateReport(data: AppData, userName: string) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(10, 15, 28); // Dark Navy
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text('Loan & EMI Tracker', 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy')}`, pageWidth - 14, 25, { align: 'right' });
    
    // User Info
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('Complete Financial Report', 14, 55);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Account Holder: ${userName}`, 14, 65);
    
    let yPos = 80;
    
    // Loans Summary
    data.loans.forEach(loan => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      const emis = data.emiSchedule.filter(e => e.loanId === loan.id);
      const totalPaid = emis.reduce((sum, e) => sum + e.amountPaid, 0);
      const remainingBalance = loan.totalPayable - totalPaid;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(59, 130, 246); // Brand blue
      doc.text(loan.loanName, 14, yPos);
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      
      const details = [
        `Principal: Rs. ${loan.principalAmount.toLocaleString()}`,
        `Interest: Rs. ${loan.totalInterest.toLocaleString()}`,
        `EMI: Rs. ${loan.emiAmount.toLocaleString()}`,
        `Remaining: Rs. ${remainingBalance.toLocaleString()}`
      ];
      
      doc.text(details[0], 14, yPos + 7);
      doc.text(details[1], 80, yPos + 7);
      doc.text(details[2], 14, yPos + 14);
      doc.text(details[3], 80, yPos + 14);
      
      yPos += 25;
      
      // EMI Table
      const tableData = emis.map(e => [
        `#${e.installmentNumber}`,
        format(new Date(e.effectiveDueDate), 'dd MMM yyyy'),
        `Rs. ${e.emiAmount.toLocaleString()}`,
        e.status.toUpperCase(),
        e.paymentDate ? format(new Date(e.paymentDate), 'dd MMM yyyy') : '-'
      ]);
      
      (doc as any).autoTable({
        startY: yPos,
        head: [['Inst.', 'Due Date', 'Amount', 'Status', 'Paid On']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 20;
    });
    
    doc.save(`Financial_Report_${format(new Date(), 'yyyyMMdd')}.pdf`);
  }
}

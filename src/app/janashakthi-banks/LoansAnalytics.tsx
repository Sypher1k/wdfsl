'use client';

import { useState } from 'react';
import type { MonthlyReport } from './ProfitabilityAnalytics';

const number = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });
const percentage = new Intl.NumberFormat('en-LK', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function LoansAnalytics({ reports }: { reports: MonthlyReport[] }) {
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const report = reports.find((item) => item.sourceFile === selectedFile) ?? reports[0]!;
  const metrics = [
    ['Outstanding Loan Amount', report.loans.outstandingLoanAmount, 'amount'],
    ['Number of Borrowers', report.loans.numberOfBorrowers, 'count'],
    ['Monthly Loan Disbursement', report.loans.monthlyLoanDisbursement, 'amount'],
    ['Monthly Borrower Count', report.loans.monthlyBorrowerCount, 'count'],
    ['At-Risk Loan Amount', report.loans.atRiskLoanAmount, 'amount'],
    ['PAR Percentage', report.loans.parPercentage, 'percent'],
    ['Total Arrears Loan Amount', report.loans.totalArrearsLoanAmount, 'amount'],
    ['Number of Arrears Borrowers', report.loans.numberOfArrearsBorrowers, 'count'],
  ] as const;

  return (
    <section className="loans-analytics" aria-labelledby="loans-analytics-title">
      <div className="loans-heading">
        <div>
          <div className="section-label">MONTHLY LENDING · {report.reportMonth}</div>
          <h2 id="loans-analytics-title">Loans</h2>
        </div>
        <label className="profit-month-filter">Month
          <select value={report.sourceFile} onChange={(event) => setSelectedFile(event.target.value)} aria-label="Filter loan metrics by month">
            {reports.map((item) => <option key={item.sourceFile} value={item.sourceFile}>{item.reportMonth}</option>)}
          </select>
        </label>
      </div>
      <div className="loans-metrics">
        {metrics.map(([label, value, kind]) => <article className="loan-metric" key={label}>
          <span>{label}</span>
          <strong>{value === null ? 'Data unavailable' : kind === 'percent' ? `${percentage.format(value)}%` : number.format(value)}</strong>
        </article>)}
      </div>
      <p className="loans-source">Source: {report.sourceFile}. Totals sum reported branch values; blank and dash entries are excluded rather than treated as zero. PAR is a weighted average of reported branch percentages using outstanding loan amount.</p>
    </section>
  );
}

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import PageShell from '@/components/PageShell';
import ProfitabilityAnalytics, { type MonthlyReport } from './ProfitabilityAnalytics';
import LoansAnalytics from './LoansAnalytics';
import SavingsAnalytics from './SavingsAnalytics';
import MembershipAnalytics from './MembershipAnalytics';

export const metadata = { title: 'Janashakthi Banks' };
export const dynamic = 'force-dynamic';

function parseCsvLine(line: string) {
  const fields: string[] = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      fields.push(field);
      field = '';
    } else {
      field += character;
    }
  }
  fields.push(field);
  return fields;
}

function parseAmount(raw: string | undefined): number | null {
  const value = raw?.trim() ?? '';
  if (!value || value === '-' || value === '—') return null;
  const isNegative = value.startsWith('(') && value.endsWith(')');
  const amount = Number(value.replace(/[(),\s]/g, ''));
  return Number.isFinite(amount) ? (isNegative ? -amount : amount) : null;
}

function monthOrdinal(file: string) {
  const match = file.match(/monthly_summary_([a-z]+)_(\d{4})\.csv$/i);
  const month = match?.[1]?.toLowerCase();
  const monthIndex = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(month ?? '');
  return match && monthIndex >= 0 ? Number(match[2]) * 12 + monthIndex : -1;
}

function readSummaryReports(): MonthlyReport[] {
  const summaryDirectory = join(process.cwd(), 'src/data/summary');
  const sourceFiles = readdirSync(summaryDirectory)
    .filter((file) => /^monthly_summary_.+\.csv$/i.test(file))
    .sort((a, b) => monthOrdinal(b) - monthOrdinal(a) || b.localeCompare(a));

  if (sourceFiles.length === 0) throw new Error(`No monthly summary CSV found in ${summaryDirectory}`);

  return sourceFiles.map((sourceFile) => {
    const lines = readFileSync(join(summaryDirectory, sourceFile), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
    const headers = parseCsvLine(lines[0] ?? '');
    const branchIndex = headers.indexOf('Bank Association');
    const monthlyProfitIndex = headers.indexOf('Monthly Profit');
    const yearToDateProfitIndex = headers.indexOf('Profit to Date');
    const loanColumnNames = {
      outstandingLoanAmount: 'Outstanding Loan Amount',
      numberOfBorrowers: 'Number of Borrowers',
      monthlyLoanDisbursement: 'Monthly Loan Disbursement',
      monthlyBorrowerCount: 'Monthly Borrower Count',
      atRiskLoanAmount: 'At-Risk Loan Amount',
      parPercentage: 'PAR Percentage',
      totalArrearsLoanAmount: 'Total Arrears Loan Amount',
      numberOfArrearsBorrowers: 'Number of Arrears Borrowers',
    } as const;
    const loanIndexes = Object.fromEntries(Object.entries(loanColumnNames).map(([key, name]) => [key, headers.indexOf(name)])) as Record<keyof typeof loanColumnNames, number>;
    const totalSavingsIndex = headers.indexOf('Total Savings Amount');
    const savingsMembersIndex = headers.indexOf('Savings Members');
    const membershipColumnNames = {
      totalMembers: 'Total Members',
      savingsMembers: 'Savings Members',
      aTypeMembers: 'A-Type Members',
      sharesCompleted: '500 Shares Completed',
      totalGroups: 'Total Number of Groups',
      aGroupCount: 'A Group Count',
      activeGroupCount: 'Active Group Count',
      totalSocieties: "Total Women's Societies",
      aSocietyCount: 'A Society Count',
      bSocietyCount: 'B Society Count',
    } as const;
    const membershipIndexes = Object.fromEntries(Object.entries(membershipColumnNames).map(([key, name]) => [key, headers.indexOf(name)])) as Record<keyof typeof membershipColumnNames, number>;
    if (branchIndex < 0 || monthlyProfitIndex < 0 || yearToDateProfitIndex < 0 || totalSavingsIndex < 0 || savingsMembersIndex < 0 || Object.values(loanIndexes).some((index) => index < 0) || Object.values(membershipIndexes).some((index) => index < 0)) {
      throw new Error(`The summary CSV is missing a required profitability, loans, savings, or membership column: ${sourceFile}`);
    }

    const branchRows = lines.slice(1).filter(Boolean).map(parseCsvLine).filter((row) => {
      const branchName = row[branchIndex]?.trim();
      // Numbered rows are branch records; the unnumbered total row is excluded.
      return Boolean(branchName && /^\d+$/.test(row[0]?.trim() ?? ''));
    });
    const branches = branchRows.map((row) => {
      const outstandingLoanAmount = parseAmount(row[loanIndexes.outstandingLoanAmount]);
      const atRiskLoanAmount = parseAmount(row[loanIndexes.atRiskLoanAmount]);
      return {
        name: row[branchIndex].trim(),
        monthlyProfit: parseAmount(row[monthlyProfitIndex]),
        yearToDateProfit: parseAmount(row[yearToDateProfitIndex]),
        loans: {
          outstandingLoanAmount,
          numberOfBorrowers: parseAmount(row[loanIndexes.numberOfBorrowers]),
          monthlyLoanDisbursement: parseAmount(row[loanIndexes.monthlyLoanDisbursement]),
          monthlyBorrowerCount: parseAmount(row[loanIndexes.monthlyBorrowerCount]),
          atRiskLoanAmount,
          parPercentage: atRiskLoanAmount !== null && outstandingLoanAmount !== null && outstandingLoanAmount > 0
            ? atRiskLoanAmount / outstandingLoanAmount * 100
            : null,
          totalArrearsLoanAmount: parseAmount(row[loanIndexes.totalArrearsLoanAmount]),
          numberOfArrearsBorrowers: parseAmount(row[loanIndexes.numberOfArrearsBorrowers]),
        },
        savings: {
          totalSavingsAmount: parseAmount(row[totalSavingsIndex]),
          savingsMembers: parseAmount(row[savingsMembersIndex]),
        },
        membership: Object.fromEntries(Object.entries(membershipIndexes).map(([key, index]) => [key, parseAmount(row[index])])) as Record<keyof typeof membershipColumnNames, number | null>,
      };
    });
    const sumReportedColumn = (columnIndex: number) => {
      const values = branchRows.map((row) => parseAmount(row[columnIndex])).filter((value): value is number => value !== null);
      return values.length ? values.reduce((total, value) => total + value, 0) : null;
    };
    const sumReported = (key: keyof typeof loanColumnNames) => sumReportedColumn(loanIndexes[key]);
    const outstandingLoanAmount = sumReported('outstandingLoanAmount');
    const atRiskLoanAmount = sumReported('atRiskLoanAmount');
    const loans = {
      outstandingLoanAmount,
      numberOfBorrowers: sumReported('numberOfBorrowers'),
      monthlyLoanDisbursement: sumReported('monthlyLoanDisbursement'),
      monthlyBorrowerCount: sumReported('monthlyBorrowerCount'),
      atRiskLoanAmount,
      parPercentage: atRiskLoanAmount !== null && outstandingLoanAmount !== null && outstandingLoanAmount > 0
        ? atRiskLoanAmount / outstandingLoanAmount * 100
        : null,
      totalArrearsLoanAmount: sumReported('totalArrearsLoanAmount'),
      numberOfArrearsBorrowers: sumReported('numberOfArrearsBorrowers'),
    };
    const savings = {
      totalSavingsAmount: sumReportedColumn(totalSavingsIndex),
      savingsMembers: sumReportedColumn(savingsMembersIndex),
    };
    const membership = Object.fromEntries(Object.entries(membershipIndexes).map(([key, index]) => [key, sumReportedColumn(index)])) as Record<keyof typeof membershipColumnNames, number | null>;

    const reportMonth = sourceFile
      .replace(/^monthly_summary_/i, '')
      .replace(/\.csv$/i, '')
      .replace(/_/g, ' ')
      .toUpperCase();
    return { branches, loans, savings, membership, reportMonth, sourceFile };
  });
}

export default function BankPage() {
  const profitabilityReports = readSummaryReports();
  return <PageShell label="JANASHAKTHI BANKS" image={{ src: '/images/wdf-img-4.jpeg', alt: 'Women gathered around records at a community banking meeting' }} title={<>Community finance, <em>built from within.</em></>}>
    <div className="content-grid">
      <div><h3>Purpose</h3><p>The Bank Society objectives include increasing family savings, providing loans for income generation, emergencies and housing, introducing social-security mechanisms, mobilizing members for social participation and bringing women together within a strong economic organization.</p></div>
      <div><h3>Membership</h3><p>The supplied Bank Development document describes group-based membership, a minimum LKR 500 share and loan eligibility after one month of membership, subject to the stated conditions.</p></div>
    </div>
    <div className="table-wrap"><table><thead><tr><th>Savings product</th><th>Annual interest</th><th>Accounting</th></tr></thead><tbody>{[['Member Shares', '4%', 'Annual'], ['Member Deposits', '3%', 'Quarterly / semi-annual'], ['Group Deposits', '3%', 'Quarterly / semi-annual'], ['Amma Deposits', '3%', 'Quarterly / semi-annual'], ['Amma Contract Deposit', '4%', 'Quarterly; paid after five years'], ['Senehasa Deposits', '3%', 'Quarterly / semi-annual'], ['Open Deposits', '3%', 'Quarterly / semi-annual']].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <p className="source-note">Product terms above are taken from the supplied Bank Development translation and should be verified with WDF before being treated as current rates.</p>
    <ProfitabilityAnalytics reports={profitabilityReports} />
    <LoansAnalytics reports={profitabilityReports} />
    <SavingsAnalytics reports={profitabilityReports} />
    <MembershipAnalytics reports={profitabilityReports} />
  </PageShell>;
}

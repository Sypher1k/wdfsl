import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { MonthlyReport } from './ProfitabilityAnalytics';

function parseCsvLine(line: string) {
  const fields: string[] = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { field += '"'; index += 1; }
      else quoted = !quoted;
    } else if (character === ',' && !quoted) { fields.push(field); field = ''; }
    else field += character;
  }
  fields.push(field);
  return fields;
}

function parseAmount(raw: string | undefined): number | null {
  const value = raw?.trim() ?? '';
  if (!value || value === '-' || value === '—') return null;
  const negative = value.startsWith('(') && value.endsWith(')');
  const amount = Number(value.replace(/[(),\s]/g, ''));
  return Number.isFinite(amount) ? (negative ? -amount : amount) : null;
}

function monthOrdinal(file: string) {
  const match = file.match(/monthly_summary_([a-z]+)_(\d{4})\.csv$/i);
  const month = match?.[1]?.toLowerCase();
  const monthIndex = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(month ?? '');
  return match && monthIndex >= 0 ? Number(match[2]) * 12 + monthIndex : -1;
}

export function readSummaryReports(): MonthlyReport[] {
  const directory = join(process.cwd(), 'src/data/summary');
  const files = readdirSync(directory).filter((file) => /^monthly_summary_.+\.csv$/i.test(file))
    .sort((a, b) => monthOrdinal(b) - monthOrdinal(a) || b.localeCompare(a));
  if (!files.length) throw new Error(`No monthly summary CSV found in ${directory}`);

  return files.map((sourceFile) => {
    const lines = readFileSync(join(directory, sourceFile), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/);
    const headers = parseCsvLine(lines[0] ?? '');
    const column = (name: string) => headers.indexOf(name);
    const branchColumn = column('Bank Association');
    const monthlyProfitColumn = column('Monthly Profit');
    const ytdProfitColumn = column('Profit to Date');
    const loanColumns = {
      outstandingLoanAmount: 'Outstanding Loan Amount', numberOfBorrowers: 'Number of Borrowers',
      monthlyLoanDisbursement: 'Monthly Loan Disbursement', monthlyBorrowerCount: 'Monthly Borrower Count',
      atRiskLoanAmount: 'At-Risk Loan Amount', totalArrearsLoanAmount: 'Total Arrears Loan Amount',
      numberOfArrearsBorrowers: 'Number of Arrears Borrowers',
    } as const;
    const membershipColumns = {
      totalMembers: 'Total Members', savingsMembers: 'Savings Members', activeMembers: 'Active Members', aTypeMembers: 'A-Type Members',
      sharesCompleted: '500 Shares Completed', sharesIncomplete: '500 Shares Incomplete', totalGroups: 'Total Number of Groups', aGroupCount: 'A Group Count',
      activeGroupCount: 'Active Group Count', inactiveGroupCount: 'Inactive Group Count', aPlusGroupCount: 'A Group Count', totalSocieties: "Total Women's Societies", aSocietyCount: 'A Society Count', bSocietyCount: 'B Society Count',
      seniorCitizensSocietyCount: "Senior Citizens' Society Count", seniorCitizenMemberCount: 'Senior Citizen Member Count',
      childrensSocietyCount: "Children's Society Count", childrensSocietyMemberCount: "Children's Society Member Count",
      modelHomeGardenCount: 'Model Home Garden Count', homeGardenDemonstrationCount: 'Home Garden Demonstration Count',
      supportServicesMonthly: 'Support Services Provided (Monthly)', specialDayCelebrationsMonthly: 'Special Day Celebrations (Monthly)',
      creativeProgrammesMonthly: 'Creative Programmes (Monthly)', deviSocietyMemberCount: 'Devi Society Member Count', deviSocietyCount: 'Devi Society Count',
    } as const;
    const loanIndexes = Object.fromEntries(Object.entries(loanColumns).map(([key, name]) => [key, column(name)])) as Record<keyof typeof loanColumns, number>;
    const membershipIndexes = Object.fromEntries(Object.entries(membershipColumns).map(([key, name]) => [key, column(name)])) as Record<keyof typeof membershipColumns, number>;
    // The source CSV repeats “A Group Count”; its second occurrence is the A+ group count.
    membershipIndexes.aPlusGroupCount = headers.reduce<number[]>((matches, header, index) => header === 'A Group Count' ? [...matches, index] : matches, [])[1] ?? -1;
    const savingsColumn = column('Total Savings Amount');
    const savingsMembersColumn = column('Savings Members');
    if ([branchColumn, monthlyProfitColumn, ytdProfitColumn, savingsColumn, savingsMembersColumn, ...Object.values(loanIndexes), ...Object.values(membershipIndexes)].some((index) => index < 0)) {
      throw new Error(`The summary CSV is missing a required column: ${sourceFile}`);
    }
    const rows = lines.slice(1).filter(Boolean).map(parseCsvLine).filter((row) => row[branchColumn]?.trim() && /^\d+$/.test(row[0]?.trim() ?? ''));
    const sum = (index: number) => {
      const values = rows.map((row) => parseAmount(row[index])).filter((value): value is number => value !== null);
      return values.length ? values.reduce((total, value) => total + value, 0) : null;
    };
    const branches = rows.map((row) => {
      const outstandingLoanAmount = parseAmount(row[loanIndexes.outstandingLoanAmount]);
      const atRiskLoanAmount = parseAmount(row[loanIndexes.atRiskLoanAmount]);
      return {
        name: row[branchColumn].trim(), monthlyProfit: parseAmount(row[monthlyProfitColumn]), yearToDateProfit: parseAmount(row[ytdProfitColumn]),
        loans: {
          outstandingLoanAmount, numberOfBorrowers: parseAmount(row[loanIndexes.numberOfBorrowers]),
          monthlyLoanDisbursement: parseAmount(row[loanIndexes.monthlyLoanDisbursement]), monthlyBorrowerCount: parseAmount(row[loanIndexes.monthlyBorrowerCount]),
          atRiskLoanAmount, parPercentage: atRiskLoanAmount !== null && outstandingLoanAmount !== null && outstandingLoanAmount > 0 ? atRiskLoanAmount / outstandingLoanAmount * 100 : null,
          totalArrearsLoanAmount: parseAmount(row[loanIndexes.totalArrearsLoanAmount]), numberOfArrearsBorrowers: parseAmount(row[loanIndexes.numberOfArrearsBorrowers]),
        },
        savings: { totalSavingsAmount: parseAmount(row[savingsColumn]), savingsMembers: parseAmount(row[savingsMembersColumn]) },
        membership: Object.fromEntries(Object.entries(membershipIndexes).map(([key, index]) => [key, parseAmount(row[index])])) as MonthlyReport['membership'],
      };
    });
    const outstandingLoanAmount = sum(loanIndexes.outstandingLoanAmount);
    const atRiskLoanAmount = sum(loanIndexes.atRiskLoanAmount);
    const loans: MonthlyReport['loans'] = {
      outstandingLoanAmount, numberOfBorrowers: sum(loanIndexes.numberOfBorrowers), monthlyLoanDisbursement: sum(loanIndexes.monthlyLoanDisbursement),
      monthlyBorrowerCount: sum(loanIndexes.monthlyBorrowerCount), atRiskLoanAmount,
      parPercentage: atRiskLoanAmount !== null && outstandingLoanAmount !== null && outstandingLoanAmount > 0 ? atRiskLoanAmount / outstandingLoanAmount * 100 : null,
      totalArrearsLoanAmount: sum(loanIndexes.totalArrearsLoanAmount), numberOfArrearsBorrowers: sum(loanIndexes.numberOfArrearsBorrowers),
    };
    return {
      branches, loans, savings: { totalSavingsAmount: sum(savingsColumn), savingsMembers: sum(savingsMembersColumn) },
      membership: Object.fromEntries(Object.entries(membershipIndexes).map(([key, index]) => [key, sum(index)])) as MonthlyReport['membership'],
      reportMonth: sourceFile.replace(/^monthly_summary_/i, '').replace(/\.csv$/i, '').replace(/_/g, ' ').toUpperCase(), sourceFile,
    };
  });
}

export function readBranchNames() {
  return readFileSync(join(process.cwd(), 'src/data/branches.csv'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).slice(1).map((name) => name.trim()).filter(Boolean);
}

export function branchSlug(name: string) {
  return name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

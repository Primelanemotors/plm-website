export interface FinanceCalculationInput {
  vehiclePrice: number;
  depositPercentage: number;
  loanTermMonths: number;
  balloonPercentage: number;
}

export interface FinanceCalculationResult {
  monthlyInstallment: number;
  principalFinanced: number;
  deposit: number;
  balloonAmount: number;
  interestRateAnnual: number;
  disclaimer: string;
}

const DEFAULT_INTEREST_RATE = 13.75;

export function calculateEstimatedInstallment(
  input: FinanceCalculationInput
): FinanceCalculationResult {
  const {
    vehiclePrice,
    depositPercentage,
    loanTermMonths,
    balloonPercentage,
  } = input;

  const deposit = vehiclePrice * (depositPercentage / 100);
  const principalFinanced = Math.max(vehiclePrice - deposit, 0);
  const balloonAmount =
    principalFinanced * (balloonPercentage / 100);

  const monthlyRate = DEFAULT_INTEREST_RATE / 100 / 12;

  const financedAfterBalloon =
    Math.max(principalFinanced - balloonAmount, 0);

  let monthlyInstallment = 0;

  if (loanTermMonths > 0 && financedAfterBalloon > 0) {
    monthlyInstallment =
      (financedAfterBalloon * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -loanTermMonths));
  }

  return {
    monthlyInstallment,
    principalFinanced,
    deposit,
    balloonAmount,
    interestRateAnnual: DEFAULT_INTEREST_RATE,
    disclaimer:
      'This calculator provides an estimate only. Actual finance approval, interest rate, fees, residual value and monthly repayment are determined by the applicable credit provider after assessment.',
  };
}

export function formatZAR(value: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(value);
}

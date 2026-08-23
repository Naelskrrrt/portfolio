"use client";

import { useMemo, useState } from "react";

export type RoiCalculatorCopy = {
  scenarioLabel: string;
  manualHoursLabel: string;
  manualHoursHint: string;
  recoveryRateLabel: string;
  recoveryRateHint: string;
  costLabel: string;
  costHint: string;
  runLabel: string;
  runHint: string;
  investmentLabel: string;
  recoveredHoursLabel: string;
  grossMonthlyValueLabel: string;
  netMonthlyValueLabel: string;
  paybackLabel: string;
  paybackUnit: string;
  annualRoiLabel: string;
  breakEvenLabel: string;
  formula: string;
  disclaimer: string;
};

type RoiCalculatorProps = {
  locale: string;
  investment: number;
  monthlyRun: number;
  copy: RoiCalculatorCopy;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function RoiCalculator({ locale, investment, monthlyRun, copy }: RoiCalculatorProps) {
  const [manualHours, setManualHours] = useState(40);
  const [recoveryRate, setRecoveryRate] = useState(40);
  const [hourlyCost, setHourlyCost] = useState(60);
  const [includeRun, setIncludeRun] = useState(true);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const number = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale],
  );

  const recoveredHours = manualHours * (recoveryRate / 100);
  const grossMonthlyValue = recoveredHours * hourlyCost;
  const recurringCost = includeRun ? monthlyRun : 0;
  const netMonthlyValue = grossMonthlyValue - recurringCost;
  const annualValue = grossMonthlyValue * 12;
  const annualCost = investment + recurringCost * 12;
  const paybackMonths = netMonthlyValue > 0 ? investment / netMonthlyValue : null;
  const annualRoi = ((annualValue - annualCost) / annualCost) * 100;
  const breakEvenHours = hourlyCost > 0 ? annualCost / 12 / hourlyCost : null;

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
      <div className="bg-background px-5 py-4 sm:px-7">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
          {copy.scenarioLabel}
        </p>
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)]">
        <div className="space-y-7 bg-background p-5 sm:p-7">
          <label className="block">
            <span className="flex items-baseline justify-between gap-4 text-sm font-semibold text-foreground">
              {copy.manualHoursLabel}
              <span className="font-mono text-lg tabular-nums text-primary">{manualHours} h</span>
            </span>
            <input
              type="range"
              min="0"
              max="160"
              step="1"
              value={manualHours}
              onChange={(event) => setManualHours(clamp(Number(event.target.value), 0, 160))}
              className="mt-4 h-2 w-full cursor-pointer accent-primary"
            />
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
              {copy.manualHoursHint}
            </span>
          </label>

          <label className="block">
            <span className="flex items-baseline justify-between gap-4 text-sm font-semibold text-foreground">
              {copy.recoveryRateLabel}
              <span className="font-mono text-lg tabular-nums text-primary">{recoveryRate} %</span>
            </span>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={recoveryRate}
              onChange={(event) => setRecoveryRate(clamp(Number(event.target.value), 10, 80))}
              className="mt-4 h-2 w-full cursor-pointer accent-primary"
            />
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
              {copy.recoveryRateHint}
            </span>
          </label>

          <label className="block">
            <span className="flex items-baseline justify-between gap-4 text-sm font-semibold text-foreground">
              {copy.costLabel}
              <span className="font-mono text-lg tabular-nums text-primary">
                {currency.format(hourlyCost)}
              </span>
            </span>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              value={hourlyCost}
              onChange={(event) => setHourlyCost(clamp(Number(event.target.value), 20, 200))}
              className="mt-4 h-2 w-full cursor-pointer accent-primary"
            />
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
              {copy.costHint}
            </span>
          </label>

          <div className="flex items-baseline justify-between gap-4 border-t border-border pt-5">
            <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {copy.investmentLabel}
            </span>
            <strong className="font-mono text-xl tabular-nums text-foreground">
              {currency.format(investment)}
            </strong>
          </div>

          <label className="grid cursor-pointer grid-cols-[auto_1fr] gap-x-3 border-t border-border pt-5">
            <input
              type="checkbox"
              checked={includeRun}
              onChange={(event) => setIncludeRun(event.target.checked)}
              className="mt-0.5 size-4 accent-primary"
            />
            <span>
              <span className="block text-sm font-semibold text-foreground">
                {copy.runLabel} · {currency.format(monthlyRun)}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {copy.runHint}
              </span>
            </span>
          </label>
        </div>

        <div aria-live="polite" className="bg-primary p-5 text-primary-foreground sm:p-7">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
            {copy.paybackLabel}
          </p>
          <p className="mt-3 font-elegant text-6xl leading-none tracking-[-0.04em] sm:text-7xl">
            {paybackMonths === null ? "—" : number.format(paybackMonths)}
            <span className="ml-2 font-sans text-base tracking-normal text-primary-foreground/75">
              {paybackMonths === null ? "" : copy.paybackUnit}
            </span>
          </p>

          <dl className="mt-8 grid gap-px bg-primary-foreground/20 sm:grid-cols-2">
            <div className="bg-primary p-4 pl-0 sm:pl-4">
              <dt className="text-[11px] uppercase tracking-[0.12em] text-primary-foreground/75">
                {copy.recoveredHoursLabel}
              </dt>
              <dd className="mt-2 font-mono text-xl font-semibold tabular-nums">
                {number.format(recoveredHours)} h
              </dd>
            </div>
            <div className="bg-primary p-4 pr-0 sm:pr-4">
              <dt className="text-[11px] uppercase tracking-[0.12em] text-primary-foreground/75">
                {copy.grossMonthlyValueLabel}
              </dt>
              <dd className="mt-2 font-mono text-xl font-semibold tabular-nums">
                {currency.format(grossMonthlyValue)}
              </dd>
            </div>
            <div className="bg-primary p-4 pl-0 sm:pl-4">
              <dt className="text-[11px] uppercase tracking-[0.12em] text-primary-foreground/75">
                {copy.netMonthlyValueLabel}
              </dt>
              <dd className="mt-2 font-mono text-xl font-semibold tabular-nums">
                {currency.format(netMonthlyValue)}
              </dd>
            </div>
            <div className="bg-primary p-4 pr-0 sm:pr-4">
              <dt className="text-[11px] uppercase tracking-[0.12em] text-primary-foreground/75">
                {copy.annualRoiLabel}
              </dt>
              <dd className="mt-2 font-mono text-xl font-semibold tabular-nums">
                {annualRoi > 0 ? "+" : ""}{number.format(annualRoi)} %
              </dd>
            </div>
          </dl>

          <p className="mt-6 border-t border-primary-foreground/20 pt-4 text-xs leading-relaxed text-primary-foreground/80">
            {copy.breakEvenLabel}{" "}
            <strong className="text-primary-foreground">
              {breakEvenHours === null ? "—" : `${number.format(breakEvenHours)} h`}
            </strong>
          </p>
        </div>
      </div>

      <div className="grid gap-2 bg-background px-5 py-4 text-[11px] leading-relaxed text-muted-foreground sm:px-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
        <p className="font-mono">{copy.formula}</p>
        <p>{copy.disclaimer}</p>
      </div>
    </div>
  );
}

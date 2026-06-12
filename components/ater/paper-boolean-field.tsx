import type { ReactNode } from "react";

function OptionPill({
  children,
  name,
  value,
  checked,
  disabled,
  tone,
}: {
  children: ReactNode;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  tone: "yes" | "no" | "neutral";
}) {
  const toneClass = {
    yes: "hover:border-emerald-300 hover:bg-emerald-50 peer-checked:border-emerald-600 peer-checked:bg-emerald-600",
    no: "hover:border-rose-300 hover:bg-rose-50 peer-checked:border-rose-600 peer-checked:bg-rose-600",
    neutral: "hover:border-slate-400 hover:bg-slate-50 peer-checked:border-slate-700 peer-checked:bg-slate-700",
  }[tone];

  return (
    <label
      className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 transition ${
        disabled ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <input name={name} type="radio" value={value} defaultChecked={checked} disabled={disabled} className="peer sr-only" />
      <span className={`h-3.5 w-3.5 rounded-full border-2 border-slate-300 bg-white transition ${toneClass}`} />
      {children}
    </label>
  );
}

export function PaperBooleanOptions({
  name,
  defaultValue,
  yesLabel = "Sim",
  noLabel = "Não",
  disabled = false,
}: {
  name: string;
  defaultValue?: boolean | null;
  yesLabel?: string;
  noLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`mt-2 flex flex-wrap items-center gap-2 text-sm ${disabled ? "opacity-75" : ""}`}>
      <OptionPill name={name} value="true" checked={defaultValue === true} disabled={disabled} tone="yes">
        {yesLabel}
      </OptionPill>
      <OptionPill name={name} value="false" checked={defaultValue === false} disabled={disabled} tone="no">
        {noLabel}
      </OptionPill>
    </div>
  );
}

export function PaperTernaryOptions({
  name,
  defaultValue,
  yesLabel = "Sim",
  noLabel = "Não",
  notApplicableLabel = "Não se aplica",
  disabled = false,
}: {
  name: string;
  defaultValue?: boolean | null;
  yesLabel?: string;
  noLabel?: string;
  notApplicableLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`mt-2 flex flex-wrap items-center gap-2 text-sm ${disabled ? "opacity-75" : ""}`}>
      <OptionPill name={name} value="true" checked={defaultValue === true} disabled={disabled} tone="yes">
        {yesLabel}
      </OptionPill>
      <OptionPill name={name} value="false" checked={defaultValue === false} disabled={disabled} tone="no">
        {noLabel}
      </OptionPill>
      <OptionPill name={name} value="nao_se_aplica" disabled={disabled} tone="neutral">
        {notApplicableLabel}
      </OptionPill>
    </div>
  );
}

export function PaperBooleanField({
  label,
  name,
  defaultValue,
  yesLabel,
  noLabel,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: boolean | null;
  yesLabel?: string;
  noLabel?: string;
  disabled?: boolean;
}) {
  return (
    <fieldset className="block">
      <legend className="text-sm font-medium text-slate-700">{label}</legend>
      <PaperBooleanOptions name={name} defaultValue={defaultValue} yesLabel={yesLabel} noLabel={noLabel} disabled={disabled} />
    </fieldset>
  );
}

export function PaperTernaryField({
  label,
  name,
  defaultValue,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: boolean | null;
  disabled?: boolean;
}) {
  return (
    <fieldset className="block">
      <legend className="text-sm font-medium text-slate-700">{label}</legend>
      <PaperTernaryOptions name={name} defaultValue={defaultValue} disabled={disabled} />
    </fieldset>
  );
}

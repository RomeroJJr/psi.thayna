export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 94 113"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M39 105c4-19 9-39 8-64M45 77C34 67 20 54 13 39m34 16c9-10 16-22 21-32" />
      <path d="M45 77C27 78 12 65 6 45c17 2 33 13 39 32Zm2-16C28 58 22 44 21 29c15 5 25 18 26 32Zm1-16C37 34 37 17 44 5c11 11 12 27 4 40Zm1 8c-1-18 10-33 26-41 1 17-9 33-26 41Zm-2 15c7-19 21-27 39-28-4 16-19 28-39 28Zm-4 18c7-15 21-22 36-19-7 13-21 20-36 19Z" />
    </svg>
  );
}
export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Thayna Christer, início">
      <Sprig />
      <span>
        Thayna Christer<small>PSICOLOGIA CLÍNICA</small>
      </span>
    </a>
  );
}

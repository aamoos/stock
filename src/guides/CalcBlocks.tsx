import type { ReactNode } from 'react';

interface CalcTableProps {
  caption: string;
  head: string[];
  rows: ReactNode[][];
}

export function CalcTable({ caption, head, rows }: CalcTableProps) {
  return (
    <figure className="calc-figure">
      <figcaption>{caption}</figcaption>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((cells, i) => (
              <tr key={i}>{cells.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

interface BarListProps {
  caption: string;
  rows: { label: string; value: number; display: string }[];
}

/** 값이 0 이상인 한 가지 항목을 비교하는 막대. 같은 값이 표에도 있어야 한다. */
export function BarList({ caption, rows }: BarListProps) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <figure className="calc-figure">
      <figcaption>{caption}</figcaption>
      <ul className="bar-list">
        {rows.map((r) => (
          <li key={r.label} title={`${r.label}: ${r.display}`}>
            <span className="bar-label">{r.label}</span>
            <span className="bar-track">
              <span className="bar-fill" style={{ width: `${(r.value / max) * 100}%` }} />
            </span>
            <span className="bar-value">{r.display}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

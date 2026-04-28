"use client";

import Link from "next/link";

export interface Dataset {
  id: string;
  name: string;
  size: string;
  updatedAt: string;
  extension: "csv" | "parquet" | "json" | "geo";
  bars: number[]; 
  rows?: string;
  cols?: string;
  records?: string;
  layers?: string;
}

interface DatasetItemProps {
  dataset: Dataset;
}

export function DatasetItem({ dataset }: DatasetItemProps) {
  return (
    <Link href={`/datasets/${dataset.id}`} className="dataset">
      <div className="ds-ico" data-ext={dataset.extension}>
        {dataset.extension === "parquet" ? "PRQ" : dataset.extension === "json" ? "JSN" : dataset.extension.toUpperCase()}
      </div>
      <div>
        <div className="ds-name">{dataset.name}</div>
        <div className="ds-meta">
          {dataset.cols && dataset.rows && (
            <>
              <span>{dataset.cols} cols · {dataset.rows} rows</span>
              <div className="sep"></div>
            </>
          )}
          {dataset.records && (
            <>
              <span>{dataset.records} records</span>
              <div className="sep"></div>
            </>
          )}
          {dataset.layers && (
            <>
              <span>{dataset.layers} layers</span>
              <div className="sep"></div>
            </>
          )}
          <span>{dataset.size}</span>
          <div className="sep"></div>
          <span>Updated {dataset.updatedAt}</span>
        </div>
      </div>
      <div className="ds-bars">
        {dataset.bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }}></span>
        ))}
      </div>
    </Link>
  );
}

'use client';

import { useState } from 'react';
import { Table2, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface TableCardProps {
  data: {
    headers: string[];
    rows: (string | number)[][];
    title?: string;
    sortable?: boolean;
  };
}

export function TableCard({ data }: TableCardProps) {
  const { headers, rows, title, sortable = true } = data;
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnIndex: number) => {
    if (!sortable) return;
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (sortColumn === null) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal);
    const bStr = String(bVal);
    return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

  const getCellColor = (cell: string | number, headerLower: string) => {
    if (typeof cell !== 'number') return '';
    if (headerLower.includes('roas') && cell >= 3) return 'text-green-600 font-bold';
    if (headerLower.includes('roas') && cell < 2) return 'text-red-600 font-semibold';
    if (headerLower.includes('cpa') && cell < 30) return 'text-green-600 font-semibold';
    if (headerLower.includes('cpa') && cell > 50) return 'text-red-600 font-semibold';
    if (headerLower.includes('ctr') && cell > 2) return 'text-green-600 font-semibold';
    if (headerLower.includes('ctr') && cell < 1) return 'text-red-600 font-semibold';
    return '';
  };

  return (
    <div className="space-y-4">
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <Table2 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
        </motion.div>
      )}
      <div className="overflow-x-auto rounded-xl border-2 border-gray-200 bg-white shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
              {headers.map((header, idx) => {
                const isNumeric = rows.length > 0 && typeof rows[0][idx] === 'number';
                const isSorted = sortColumn === idx;
                return (
                  <motion.th
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => sortable && isNumeric && handleSort(idx)}
                    className={`px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ${
                      sortable && isNumeric ? 'cursor-pointer hover:bg-blue-100 transition-colors' : ''
                    } ${isSorted ? 'bg-blue-100' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {sortable && isNumeric && (
                        <div className="flex flex-col">
                          <ArrowUp className={`w-3 h-3 ${isSorted && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                          <ArrowDown className={`w-3 h-3 -mt-1 ${isSorted && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                        </div>
                      )}
                    </div>
                  </motion.th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIdx) => {
              const headerLower = headers[0]?.toLowerCase() || '';
              const isChannelRow = typeof row[0] === 'string';
              return (
                <motion.tr
                  key={rowIdx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rowIdx * 0.05 + 0.2, type: 'spring', stiffness: 200 }}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/70 hover:via-indigo-50/70 hover:to-purple-50/70 transition-all duration-200"
                >
                  {row.map((cell, cellIdx) => {
                    const headerLower = headers[cellIdx]?.toLowerCase() || '';
                    const cellColor = getCellColor(cell, headerLower);
                    const isCurrency = typeof cell === 'number' && (headerLower.includes('spend') || headerLower.includes('revenue') || headerLower.includes('cpa') || headerLower.includes('cpc'));
                    const isPercentage = typeof cell === 'number' && (headerLower.includes('ctr') || headerLower.includes('conv') || headerLower.includes('rate'));
                    const isROAS = typeof cell === 'number' && headerLower.includes('roas');
                    
                    return (
                      <motion.td
                        key={cellIdx}
                        className={`px-4 py-3 text-sm ${
                          cellIdx === 0 ? 'font-bold text-gray-900' : cellColor || 'text-gray-700'
                        }`}
                      >
                        {typeof cell === 'number' ? (
                          <span>
                            {isCurrency && '$'}
                            {cell.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            {isPercentage && '%'}
                            {isROAS && 'x'}
                          </span>
                        ) : (
                          cell
                        )}
                      </motion.td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


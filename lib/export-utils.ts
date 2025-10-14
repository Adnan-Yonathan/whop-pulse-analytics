/**
 * Utility functions for exporting data to CSV format
 */

export interface ExportOptions {
  filename: string;
  includeHeaders?: boolean;
  dateFormat?: 'iso' | 'readable';
}

/**
 * Convert an array of objects to CSV format
 */
export function arrayToCSV(data: any[], options: ExportOptions = { filename: 'export.csv' }): string {
  if (!data || data.length === 0) {
    return '';
  }

  const { includeHeaders = true, dateFormat = 'readable' } = options;
  
  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Format headers
  const formattedHeaders = headers.map(header => 
    header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  );

  // Convert data rows
  const rows = data.map(row => 
    headers.map(header => {
      let value = row[header];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      }
      
      if (typeof value === 'object' && value instanceof Date) {
        if (dateFormat === 'iso') {
          return value.toISOString();
        } else {
          return value.toLocaleDateString();
        }
      }
      
      if (typeof value === 'string' && value.includes(',')) {
        // Escape commas in strings
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return String(value);
    })
  );

  // Combine headers and rows
  const csvContent = includeHeaders 
    ? [formattedHeaders.join(','), ...rows.map(row => row.join(','))].join('\n')
    : rows.map(row => row.join(',')).join('\n');

  return csvContent;
}

/**
 * Download CSV data as a file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export data array directly to CSV file
 */
export function exportToCSV(data: any[], options: ExportOptions): void {
  const csvContent = arrayToCSV(data, options);
  downloadCSV(csvContent, options.filename);
}

/**
 * Format date for CSV export
 */
export function formatDateForCSV(date: Date | string, format: 'iso' | 'readable' = 'readable'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'iso') {
    return dateObj.toISOString();
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Sanitize filename for download
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string, extension: string = 'csv'): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return sanitizeFilename(`${prefix}_${timestamp}.${extension}`);
}

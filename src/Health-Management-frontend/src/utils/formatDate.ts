/**
 * Formats a date from various input types to a human-readable string
 * Handles string dates, bigint timestamps, and standard Date objects
 * 
 * @param date The date to format (string, bigint, or Date)
 * @returns Formatted date string in Month Day, Year format with time
 */
export const formatDate = (date: string | bigint | Date | undefined): string => {
  try {
    if (typeof date === 'undefined' || date === null) {
      console.error('RecordDetail: Date is undefined or null');
      return 'Unknown date';
    }

    let timestamp: number;

    if (date instanceof Date) {
      timestamp = date.getTime();
    } else if (typeof date === 'string') {
      // Check if date is a numeric string (timestamp in milliseconds)
      if (/^\d+$/.test(date)) {
        timestamp = parseInt(date);
      } else {
        // Try to parse as ISO date string
        timestamp = Date.parse(date);
      }
    } else if (typeof date === 'bigint') {
      // Convert BigInt timestamp from nanoseconds to milliseconds
      timestamp = Number(date) / 1000000;
    } else {
      console.error('RecordDetail: Unexpected date type:', typeof date);
      return 'Invalid date format';
    }

    // Check if timestamp is valid
    if (isNaN(timestamp)) {
      console.error('RecordDetail: Invalid timestamp after conversion:', timestamp);
      return 'Invalid date';
    }

    // Format the date
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('RecordDetail: Error formatting date:', e, 'Date value:', date);
    return 'Error formatting date';
  }
}; 
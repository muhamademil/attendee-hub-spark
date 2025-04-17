
// Function to format currency as IDR (Indonesian Rupiah)
export const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Function to format large numbers with K, M, etc.
export const formatCompactNumber = (number: number): string => {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(number);
};

// Function to truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Function to generate random alphanumeric string (e.g., for referral codes)
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to format transaction status for display
export const formatTransactionStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    waiting_for_payment: 'Waiting for Payment',
    waiting_for_confirmation: 'Waiting for Confirmation',
    done: 'Completed',
    rejected: 'Rejected',
    expired: 'Expired',
    canceled: 'Canceled'
  };
  
  return statusMap[status] || status;
};

// Function to get color based on transaction status
export const getStatusColor = (status: string): string => {
  const statusColorMap: Record<string, string> = {
    waiting_for_payment: 'bg-waiting text-waiting-foreground',
    waiting_for_confirmation: 'bg-amber-100 text-amber-800',
    done: 'bg-success text-success-foreground',
    rejected: 'bg-destructive text-destructive-foreground',
    expired: 'bg-expired text-expired-foreground',
    canceled: 'bg-gray-100 text-gray-800'
  };
  
  return statusColorMap[status] || 'bg-gray-100 text-gray-800';
};

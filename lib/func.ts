export function getPreviousDayValues(): Record<string, Date> {
     const today = new Date();

     // Calculate yesterday's date
     const yesterday = new Date(today);
     yesterday.setDate(today.getDate() - 1);

     // Start of yesterday
     const startOfYesterday = new Date(yesterday);
     startOfYesterday.setHours(0, 0, 0, 0);

     // End of yesterday
     const endOfYesterday = new Date(yesterday);
     endOfYesterday.setHours(23, 59, 59, 999);
     return {
          startOfYesterday,
          endOfYesterday
     };
}
const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigits(num: number): string {
  if (num < 20) return ones[num];
  return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
}

function threeDigits(num: number): string {
  if (num >= 100) {
    return (
      ones[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 ? " " + twoDigits(num % 100) : "")
    );
  }
  return twoDigits(num);
}

export function numberToIndianWords(amount: number): string {
  if (amount === 0) return "Zero Rupees Only";

  const num = Math.floor(amount);
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;

  const parts: string[] = [];
  if (crore) parts.push(threeDigits(crore) + " Crore");
  if (lakh) parts.push(threeDigits(lakh) + " Lakh");
  if (thousand) parts.push(threeDigits(thousand) + " Thousand");
  if (rest) parts.push(threeDigits(rest));

  return parts.join(" ") + " Rupees Only";
}

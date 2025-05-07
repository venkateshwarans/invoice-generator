import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert number to words
export function numberToWords(num: number): string {
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if ((num = Math.floor(num)) === 0) return 'Zero only';
  
  const numStr = num.toString();
  if (numStr.length > 9) return 'overflow';
  
  const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  
  let str = '';
  
  // Handle crore
  if (Number(n[1]) !== 0) {
    if (Number(n[1]) < 20) {
      str += a[Number(n[1])] + 'crore ';
    } else {
      const tens = Number(n[1][0]);
      const ones = Number(n[1][1]);
      str += b[tens] + (ones > 0 ? ' ' + a[ones] : '') + 'crore ';
    }
  }
  
  // Handle lakh
  if (Number(n[2]) !== 0) {
    if (Number(n[2]) < 20) {
      str += a[Number(n[2])] + 'lakh ';
    } else {
      const tens = Number(n[2][0]);
      const ones = Number(n[2][1]);
      str += b[tens] + (ones > 0 ? ' ' + a[ones] : '') + 'lakh ';
    }
  }
  
  // Handle thousand
  if (Number(n[3]) !== 0) {
    if (Number(n[3]) < 20) {
      str += a[Number(n[3])] + 'thousand ';
    } else {
      const tens = Number(n[3][0]);
      const ones = Number(n[3][1]);
      str += b[tens] + (ones > 0 ? ' ' + a[ones] : '') + 'thousand ';
    }
  }
  
  // Handle hundred
  if (Number(n[4]) !== 0) {
    str += a[Number(n[4])] + 'hundred ';
  }
  
  // Handle tens and ones
  if (Number(n[5]) !== 0) {
    if (str !== '') {
      str += 'and ';
    }
    
    if (Number(n[5]) < 20) {
      str += a[Number(n[5])];
    } else {
      const tens = Number(n[5][0]);
      const ones = Number(n[5][1]);
      str += b[tens] + (ones > 0 ? ' ' + a[ones] : '');
    }
  }
  
  // Capitalize the first letter of each word
  const capitalizedStr = str.trim()
    .split(' ')
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
    .join(' ');
    
  return capitalizedStr ? capitalizedStr + ' Only' : 'Zero Only';
}

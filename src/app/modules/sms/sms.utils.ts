/**
 * Map of English word numbers to digit strings
 */
const DIGIT_WORDS: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  oh: "0",
  nought: "0",
};

/**
 * Smart, dynamic OTP extractor from SMS text messages.
 * Handles:
 *  - Word-based sequences like IVACBD:
 *    "Four_Two_Five_Five_Four_Seven" -> "425547"
 *    "Four-Two-Five-Five-Four-Seven" -> "425547"
 *    "Four Two Five Five Four Seven" -> "425547"
 *    "Four.Two.Five.Five.Four.Seven" -> "425547"
 *    and any delimiter pattern (_, -, space, dot, slash, etc.)
 *  - Standard numeric OTPs (4 to 8 digits)
 *  - Prefixes like "code is 123456", "OTP: 1234", "G-123456"
 *  - Raw digits
 */
export const extractOtp = (body: string, explicitOtp?: string): string | null => {
  if (explicitOtp && typeof explicitOtp === "string" && explicitOtp.trim().length > 0) {
    return explicitOtp.trim();
  }

  if (!body || typeof body !== "string") {
    return null;
  }

  const cleanBody = body.trim();

  // 1. If the body is already just digits (4 to 8 digits)
  if (/^\d{4,8}$/.test(cleanBody)) {
    return cleanBody;
  }

  // 2. Targeted IVAC / sequence match:
  // e.g. "(IVACBD) For security, type the following sequence when prompted Four_Two_Five_Five_Four_Seven"
  const ivacRegex =
    /(?:type\s+(?:the\s+)?following\s+sequence(?:\s+when\s+prompted)?|sequence(?:\s+when\s+prompted)?|following\s+sequence)[^\w\d]*([a-zA-Z0-9_\-\s.,/:+|~*]+)/i;
  const ivacMatch = cleanBody.match(ivacRegex);
  if (ivacMatch && ivacMatch[1]) {
    const rawSeq = ivacMatch[1].trim();
    const tokens = rawSeq.split(/[-_\s.,/:+|~*]+/).filter(Boolean);
    const convertedDigits = tokens
      .map((t) => DIGIT_WORDS[t.toLowerCase()] || (/^\d$/.test(t) ? t : null))
      .filter((t) => t !== null)
      .join("");

    if (convertedDigits.length >= 4 && convertedDigits.length <= 8) {
      return convertedDigits;
    }
  }

  // 3. Dynamic word-based OTP sequence anywhere in the SMS:
  // Matches 4 to 8 consecutive number words or single digits separated by any delimiter (_, -, space, dot, etc.)
  const wordTokensRegex =
    /\b(zero|one|two|three|four|five|six|seven|eight|nine|oh|\d)(?:[-_\s.,/:+|~*]+(zero|one|two|three|four|five|six|seven|eight|nine|oh|\d)){3,8}\b/gi;
  const wordMatches = [...cleanBody.matchAll(wordTokensRegex)];
  if (wordMatches.length > 0) {
    let bestMatch = wordMatches[0][0];
    for (const m of wordMatches) {
      if (m[0].length > bestMatch.length) {
        bestMatch = m[0];
      }
    }
    const tokens = bestMatch.split(/[-_\s.,/:+|~*]+/).filter(Boolean);
    if (tokens.length >= 4 && tokens.length <= 8) {
      const digits = tokens
        .map((t) => DIGIT_WORDS[t.toLowerCase()] || t)
        .join("");
      if (/^\d{4,8}$/.test(digits)) {
        return digits;
      }
    }
  }

  // 4. Keyword prefix for numeric OTP: "code: 123456", "OTP is 482910"
  const keywordPattern =
    /(?:otp|code|pin|passcode|verification|security)[^\d\w]{0,15}(\d{4,8})\b/i;
  const keywordMatch = cleanBody.match(keywordPattern);
  if (keywordMatch && keywordMatch[1]) {
    return keywordMatch[1];
  }

  // 5. Reverse keyword: "482910 is your verification code"
  const reverseKeywordPattern =
    /\b(\d{4,8})\b[^\w\d]{0,15}(?:is\s+your|is\s+the|for\s+verification|to\s+verify)/i;
  const reverseMatch = cleanBody.match(reverseKeywordPattern);
  if (reverseMatch && reverseMatch[1]) {
    return reverseMatch[1];
  }

  // 6. Hyphenated or grouped numeric code: "123-456", "G-123456"
  const hyphenMatch = cleanBody.match(/\b(?:G-)?(\d{3})[- ](\d{3})\b/i);
  if (hyphenMatch && hyphenMatch[1] && hyphenMatch[2]) {
    return `${hyphenMatch[1]}${hyphenMatch[2]}`;
  }

  // 7. General fallback: first 4-8 digit number found
  const generalMatch = cleanBody.match(/\b(\d{4,8})\b/);
  if (generalMatch && generalMatch[1]) {
    return generalMatch[1];
  }

  return null;
};

/**
 * Normalizes phone numbers for flexible matching
 * (e.g. "+8801712345678" vs "01712345678")
 */
export const normalizePhone = (phone: string): string => {
  if (!phone) return "";
  return phone.replace(/[\s\-\+\(\)]/g, "");
};

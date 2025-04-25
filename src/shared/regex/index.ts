export const regex = {
  emailRegex: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // removed the double backslash
  phoneRegex: /^\+\d{10,14}$/, // phone number with '+' and 10-14 digits
  onlyNumbersWithPlusRegex: /^\+\d+$/, // just '+' followed by digits
  onlyNumberRegex: /^\d+$/, // just digits, no '+'
  onlyAllowedSpecialCharsRegex: /^[a-zA-Z0-9@+.\-]+$/, // allow only certain special characters
  ONLY_ALLOWED_CHARACTERS_REGEX: /^[a-zA-Z0-9 ]*$/,
  ONLY_NUMBERS_REGEX: /^[0-9]+$/
};

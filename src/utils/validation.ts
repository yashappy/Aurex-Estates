// Country codes and contact validation utility

export interface CountryCode {
  code: string;
  country: string;
  label: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: '+91', country: 'IN', label: '+91' },
  { code: '+1', country: 'US', label: '+1' },
  { code: '+971', country: 'AE', label: '+971' },
  { code: '+44', country: 'GB', label: '+44' },
  { code: '+65', country: 'SG', label: '+65' },
  { code: '+61', country: 'AU', label: '+61' },
  { code: '+966', country: 'SA', label: '+966' },
  { code: '+974', country: 'QA', label: '+974' },
  { code: '+49', country: 'DE', label: '+49' },
  { code: '+33', country: 'FR', label: '+33' },
  { code: '+81', country: 'JP', label: '+81' },
  { code: '+86', country: 'CN', label: '+86' },
  { code: '+7', country: 'RU', label: '+7' },
  { code: '+60', country: 'MY', label: '+60' },
  { code: '+968', country: 'OM', label: '+968' },
  { code: '+973', country: 'BH', label: '+973' },
  { code: '+965', country: 'KW', label: '+965' },
];

// Blocklist of known temporary / disposable email services
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'sharklasers.com',
  'trashmail.com',
  'getnada.com',
  'dispostable.com',
  'fakeinbox.com',
  'tempail.com',
  'dropmail.me',
  'burnermail.io',
  'mohmal.com',
  'crazymailing.com',
  'generator.email',
  'emailondeck.com',
  'mytrashmail.com',
  'spamgourmet.com',
  'discard.email',
  'maildrop.cc',
  'inboxkitten.com',
  'tmailor.com',
  'tempmailo.com',
  'nada.ltd',
  'guerrillamailblock.com',
  'pokemail.net',
  'fakemailgenerator.com',
  'inboxbear.com',
  'mailsac.com',
  'mailcatch.com',
  'getairmail.com',
  'mytemp.email',
  'anonymousemail.me',
  'temp-mail.io',
  'tempmailaddress.com',
  'trashmail.net',
  'disposablemail.com',
  'tempmail.net',
  'fakemail.net',
  'burnermail.com',
]);

const DUMMY_USERNAMES = new Set([
  'test',
  'fake',
  'temp',
  'dummy',
  'spam',
  'asdf',
  'admin',
  'user',
  '123',
  '1234',
  '111',
  'aaa',
  'xyz',
  'abc',
  'qwer',
  'qwerty',
  'sample',
  'none',
  'noemail',
]);

const KEYBOARD_MASH_PATTERNS = [
  'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl',
  'qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop',
  'zxcv', 'xcvb', 'cvbn', 'vbnm', 'lkjh', 'poiuy',
  'alsd', 'sdjf', 'jflk', 'fkas', 'lkdf', 'kdfh', 'dfhl', 'hlask', 'laskj'
];

export function validateName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your full name.' };
  }
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Name must be at least 3 characters long.' };
  }
  if (trimmed.length > 60) {
    return { isValid: false, error: 'Name cannot exceed 60 characters.' };
  }
  // Allow letters, spaces, hyphens, periods, apostrophes
  if (!/^[A-Za-z\s.'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Name should only contain alphabetic letters and spaces.' };
  }
  // Must contain at least one vowel
  if (!/[aeiouAEIOU]/.test(trimmed)) {
    return { isValid: false, error: 'Please enter a genuine, valid name.' };
  }
  // Avoid repetitive characters like 'aaaa', 'zzzz'
  if (/(.)\1{2,}/i.test(trimmed)) {
    return { isValid: false, error: 'Please enter a genuine name without repetitive letters.' };
  }
  // Detect unnatural consonant clusters (5 or more consonants in a row, e.g. 'lsdjflk')
  if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/.test(trimmed)) {
    return { isValid: false, error: 'Please enter a genuine, recognizable name.' };
  }
  // Check for common keyboard mashing sequences
  const lower = trimmed.toLowerCase();
  for (const pattern of KEYBOARD_MASH_PATTERNS) {
    if (lower.includes(pattern)) {
      return { isValid: false, error: 'Please enter a genuine name (avoid random keystrokes).' };
    }
  }
  // Check dummy words
  const words = lower.split(/\s+/);
  for (const w of words) {
    if (DUMMY_USERNAMES.has(w)) {
      return { isValid: false, error: 'Please provide your actual name, not a placeholder.' };
    }
  }
  // Must have at least 2 distinct letters
  const distinctLetters = new Set(lower.replace(/[^a-z]/g, ''));
  if (distinctLetters.size < 2) {
    return { isValid: false, error: 'Please enter a valid full name.' };
  }

  return { isValid: true };
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();

  // Basic RFC format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@example.com).' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  const [localPart, domain] = parts;

  // Single-digit or single-char test username (like 1@gmail.com)
  if (localPart.length < 2) {
    return { isValid: false, error: 'Please enter a genuine, valid email address.' };
  }

  if (/^\d+$/.test(localPart)) {
    // purely numeric like 123456@...
    return { isValid: false, error: 'Numeric-only email usernames are not accepted.' };
  }

  if (DUMMY_USERNAMES.has(localPart)) {
    return { isValid: false, error: 'Test or placeholder email addresses are not permitted.' };
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isValid: false, error: 'Temporary or disposable email addresses are not permitted.' };
  }

  // Reject unnatural consonant clusters in email username (e.g., 'aslkdfhlaskj')
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(localPart)) {
    return { isValid: false, error: 'Please enter a genuine email address (avoid random keystrokes).' };
  }

  // Reject keyboard mash in local part
  for (const pattern of KEYBOARD_MASH_PATTERNS) {
    if (localPart.includes(pattern)) {
      return { isValid: false, error: 'Please enter a genuine, active email address.' };
    }
  }

  // Reject test/invalid TLDs
  if (
    domain.endsWith('.test') ||
    domain.endsWith('.invalid') ||
    domain.endsWith('.example') ||
    domain.endsWith('.localhost')
  ) {
    return { isValid: false, error: 'Please enter a genuine domain.' };
  }

  return { isValid: true };
}

export function validatePhone(phone: string, countryCode: string = '+91'): { isValid: boolean; error?: string } {
  const clean = phone.replace(/\D/g, '');

  if (countryCode === '+91') {
    if (clean.length !== 10) {
      return { isValid: false, error: 'Indian mobile numbers must be exactly 10 digits.' };
    }
    // In India, legitimate mobile numbers only start with 6, 7, 8, or 9
    if (!/^[6-9]/.test(clean)) {
      return {
        isValid: false,
        error: 'Indian mobile numbers must start with 6, 7, 8, or 9 (numbers starting with 1, 2, 3, 4, 5 are not valid mobile numbers).'
      };
    }
  } else {
    // International numbers
    if (clean.length < 7 || clean.length > 15) {
      return { isValid: false, error: 'Please enter a valid mobile number.' };
    }
  }

  // Reject identical repetitive numbers (e.g. 9999999999, 8888888888, 0000000000)
  if (/^(\d)\1+$/.test(clean)) {
    return { isValid: false, error: 'Please enter a valid, non-repetitive phone number.' };
  }

  // Reject obvious sequential dummy numbers
  const DUMMY_PHONE_NUMBERS = new Set([
    '1234567890',
    '0123456789',
    '9876543210',
    '9876501234',
    '1122334455',
    '1212121212',
  ]);
  if (DUMMY_PHONE_NUMBERS.has(clean)) {
    return { isValid: false, error: 'Please enter a genuine phone number.' };
  }

  return { isValid: true };
}

import moment from "moment"

export const PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEoLPpbHiD6+it
M9s6VoK28QVi9uwNr++5fYrYtQSjgBbSfB2aupA1Dt9wwblio+wsKMytVgxOxAWK
b1JKoHAe4X5IPq3A7/SjZVqflntLtB+PIuBr19PEDZh8wM7kXMIG+Aon1mCD18gq
rxr9nJlS3yojuuJtQv0YN7cZc36TwJJ4Xu1cAsqUEc8LqL6RsOpxclqeaCoW1vUk
HbCg5htlTVfeXSSEZC2nzgvzeeGszHe7aZVBW3MUnC02ySrwW6TMhHvGqQFcbBey
/qP3E7CmABAooiq3/0Dc7RCN0N7zsxkB5par351hPqN7+pxFwOlwo1XrcBstObye
LDUXftu1AgMBAAECgf8StYW2zsqz70FH68tn9n/YJZbPtTofVhBVI+J5MRk3i7L5
Q3dsRFm8srBd8TJRKBWyKRlm1CUELReGZUNWNRTPEw9jGMAyccPz6YzD1KxQY42d
L5tR9YJw1HYrJd9+neWKcLwBE/LHjZxwRsQxpc3w9hjzUvOL/Q4z0y+WGDJUctCL
p6G4ZSUqrq+LF7f/AR2nNqwegyo0lRTrS0GHHV37wpoSao60hmkBrgyus34omz06
1d6xE0/UBUV2DNO+PN4ZmK6AEBVy+K+vKfg+pXRKX8Qg0IDkpxzhWB71DGyAx/JL
ff7P5RdE1/PKiPU31HZqG6xG+cDzCkp+NQ85JmkCgYEA/jkPUy5F6328rlbk2D5A
aZCZkbG6BTjmV3A2/Uje+Ei9EMawekHPmngaSWX2xXQEpluxcKEQ0V5CAEPN2zsr
udNfrlBrOiUZ7elsMxDaDzdBZfErdBTZqm5gMDJHrHFNH5cNoSA7gLNTffmL4t6b
2KiFy29BKbg8rvrlm0e92Y0CgYEAxgCTFHdAZgi5Jhoi0PHv9Iqt1q1H44VSsj/j
fVs29qu7lxuYzKASRwCa1p7BIDV0A/zOvd9aPqfHIzPqdaLpwbnkuisiDMYa75rw
cAgTcPm+pAYuY84rlEHDz5h4SLMxnTtJDq2UdA+Xtv/hp4zJm2g3H9o8jfKHJmup
bwS6PMkCgYEAxBpL4gRd1ywk8e8BlHVgxo3OiH6qWgDsXiKnqHYf2TJy9Y/u7j/5
3tQqotfOpb27IIC2vYThLkAhdYbYMvbP4gZVVmeebznTaJyY5ENpkjczcWm59U9o
IHoIJOWEOFcmAOpKjzIH9F1gWFq5N4Y0fcpxet4VTBNcbDYKC+ApaLkCgYEAr4lQ
24MBd7PiGPJwzVbACcdsaHcE1aOb9eUIFFlqd/M2Arf3lemPap0RqJXj118sNGDL
FK/PvN5XgFEFWjcND69zJM0aicKTnLp60IeIXM88gQPt2pOsNOq84u1kLeeXY7Js
iXO/uckdEqL1deotzfXtcPK0Xo+V26z08DR7u2kCgYEA9R0CzTSA0JO0bXcNlxzP
BCpz1sxfZ0HKLBa3Es4T/M+jecHJ6u2GCtgucb5Yo1R4Lbt454HB4z+tEZk9tc7a
nXy8xJb+TCu4VRy/+vpaBHk0gGS2LV42RZom0wQ6e/QjVqi4p8ZkBzpmEanTGpA7
Ire0t74VSp7MP6Wx9RWuMOc=
-----END PRIVATE KEY-----
`
export const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxKCz6Wx4g+vorTPbOlaC
tvEFYvbsDa/vuX2K2LUEo4AW0nwdmrqQNQ7fcMG5YqPsLCjMrVYMTsQFim9SSqBw
HuF+SD6twO/0o2Van5Z7S7QfjyLga9fTxA2YfMDO5FzCBvgKJ9Zgg9fIKq8a/ZyZ
Ut8qI7ribUL9GDe3GXN+k8CSeF7tXALKlBHPC6i+kbDqcXJanmgqFtb1JB2woOYb
ZU1X3l0khGQtp84L83nhrMx3u2mVQVtzFJwtNskq8FukzIR7xqkBXGwXsv6j9xOw
pgAQKKIqt/9A3O0QjdDe87MZAeaWq9+dYT6je/qcRcDpcKNV63AbLTm8niw1F37b
tQIDAQAB
-----END PUBLIC KEY-----
`

export const HTTP_Codes = {
    Success: 200,
    Created: 201,
    NoContent: 204,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    Confict: 409,
    UnprocessableEntity: 422,
    TooManyRequests: 429,
    ServiceUnavailable: 503,
    InternalServerError: 500,
}

export const System_Roles = {
    Super_Admin: 1,
    Admin: 2,
    Sales: 3,
    QC1: 4,
    QC2: 5,
    Agent: 6,
    Sub_User: 7,
    Product_Owner: 8,
    Operation: 9,
    Revenue: 10,
    Finance: 11,
    Management: 12,
    Telecaller: 13,
    CRM_User: 14,
    HR: 15
}

export const System_Roles_Name = {
    1: "Super_Admin",
    2: "Admin",
    3: "Sales",
    4: "QC1",
    5: "QC2",
    6: "Agent",
    7: "Sub_User",
    8: "Product_Owner",
    9: "Operation",
    10: "Revenue",
    11: "Finance",
    12: "Management",
    13: "Telecaller",
    14: "CRM_User",
    15: "HR"
};

export const Policy_Status = {
    Pending_Review: 4,
    QC1_In_Progress: 5,
    QC1_Rejected: 6,
    QC1_RFI: 7,
    QC1_Approved: 8,
    QC2_In_Progress: 9,
    QC2_Rejected: 10,
    QC2_RFI: 11,
    QC2_Approved: 12
}

export const Payout_Status = {
    Pending_Invoice: 14,
    Processing_Payment: 15,
    Paid: 16,
    Payout_Raised: 20,
}

export const Reconciliation_Status = {
    Reconciliation_Pending: 17,
    Reconciliation_Mismatch: 18,
    Reconciliation: 19,
}

export const RedemptionQueue_Status = {
    Pending: 21,
    Approved: 22,
    Paid: 23,
}

export const Regex_Patterns = {
    emailPattern: /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,3})$/,
    phoneNumberPattern: /^[0-9]{10}$/,
}
export const OTPVerificationTimer = 300;

export const Entity_Types = {
    Notification: 1,
    Policy: 2,
    Personal_Documents: 3,
    Qualification_Documents: 4,
    Policy_Payout: 5,
    Bank_Documents: 9
}


export function ConvertDateFormat(dateString: moment.MomentInput): string {
    if (!dateString || typeof dateString !== 'string') {
        return 'Invalid date';
    }

    let input = (dateString as string).trim();

    // Normalize common terms
    input = input
        .replace(/hrs?/gi, '')                // remove "hrs" or "hr"
        .replace(/hours?/gi, '')              // remove "hours"
        .replace(/midnight/gi, '00:00:00')    // replace "midnight"
        .replace(/\bAM\b/i, 'AM')             // standardize AM/PM
        .replace(/\bPM\b/i, 'PM')
        .replace(/\bon/i, '')                 // remove "on" (e.g. "midnight on26")
        .replace(/(\d{2})([A-Z]{3,})/, '$1-$2') // handle e.g. "24MAY2025" → "24-MAY-2025"
        .replace(/\((.*?)\)/g, '')            // remove parenthetical parts e.g., (Hrs)
        .replace(/\s+/g, ' ')                 // collapse multiple spaces
        .trim();

    const formats = [
        'DD MMM, YYYY HH:mm',          // <== for "05 Jun, 2025 00:01"
        'DD MMM, YYYY HH:mm:ss',
        'DD-MM-YYYY HH:mm:ss',
        'DD/MM/YYYY HH:mm:ss',
        'DD-MMM-YYYY HH:mm:ss',
        'DD-MMM-YYYY HH:mm A',
        'DD-MMM-YYYY HH:mm',
        'DD-MM-YYYY HH:mm',
        'DD/MM/YYYY HH:mm',
        'DD-MM-YYYY',
        'DD/MM/YYYY',
        'DD-MMM-YYYY',
        'DD MMM YYYY',
        'DD MMM, YYYY',
        'MMM DD, YYYY',
        'MMMM DD, YYYY',
        'YYYY-MM-DD',
    ];

    const parsedDate = moment(input, formats, true);

    return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : 'Invalid date';
}

export const CoverageType = {
    "Comprehensive": "Comprehensive",
    "OD": "Own Damage",
    "TP": "Third Party",
    "ODOnly": "Own Damage Only",
    "TPOnly": "Third Party Only",
}

export const Auditlog_Module = {
    Login: 21
}

export const Document_Types = {
    RFI_DocumentTypeId: 6,
    Support_DocumentTypeId: 7,
    Uploaded_DocumentTypeId: 5
}

export const Endorsement_Status = {
    Pending: 1,
    InProgress: 2,
    Completed: 3
}

let base_url = "";

export const initCdn = async () => {
    try {
        const response = await fetch("/config.json");
        const config = await response.json();
        base_url = config.CDN_BASE_URL;
    } catch (error) {
        console.error("Failed to load CDN config:", error);
        base_url = ""; // fallback
    }
};
export const cdnURLs = (value: string) => {
  if (!value) return "/fallback-image.png";

  if (value.startsWith("blob:")) return value;

  if (value.startsWith("http")) return value;

  if (!base_url) return value;

  const cleanBase = base_url.endsWith("/")
    ? base_url.slice(0, -1)
    : base_url;

  const cleanPath = value.startsWith("/")
    ? value.slice(1)
    : value;
  return `${cleanBase}/${cleanPath}`;

};
// This is now a synchronous function you can use in <img> tags
export const cdnURL = (value: string) => {
    if (!value) return "";
    // Ensure no double slashes
    const cleanBase = base_url.endsWith('/') ? base_url.slice(0, -1) : base_url;
    const cleanPath = value.startsWith('/') ? value.slice(1) : value;
    return `${cleanBase}/${cleanPath}`;
};
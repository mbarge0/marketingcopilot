# Error Handling & Error Codes
## Marketing Co-Pilot - Error Handling Patterns

**Version:** 1.0  
**Last Updated:** November 6, 2025

---

## Google Ads API Error Codes

### Common Errors

| Error Code | HTTP Status | Description | User Message | Fix Suggestions |
|------------|-------------|-------------|--------------|-----------------|
| `PERMISSION_DENIED` | 403 | User doesn't have permission | "You don't have permission to perform this action" | Verify OAuth scopes, check account access |
| `QUOTA_EXCEEDED` | 429 | API rate limit exceeded | "API rate limit reached. Please try again later" | Wait before retrying, check cache |
| `POLICY_VIOLATION` | 400 | Campaign violates Google Ads policies | "Campaign rejected: [specific reason]" | Review ad copy, check landing page |
| `BUDGET_EXCEEDED` | 400 | Account budget limit reached | "Account budget limit reached" | Increase account budget in Google Ads |
| `INVALID_ARGUMENT` | 400 | Invalid parameter value | "Invalid campaign settings: [field]" | Check field values, review requirements |
| `NOT_FOUND` | 404 | Resource doesn't exist | "Campaign not found" | Verify campaign ID exists |
| `UNAUTHENTICATED` | 401 | Token expired or invalid | "Session expired. Please reconnect" | Refresh token, reconnect account |

### Error Handler Implementation

**File: `lib/google-ads/error-handler.ts`**

```typescript
export interface GoogleAdsError {
  code: string;
  message: string;
  details?: any;
  fixSuggestions?: string[];
  userFriendly?: boolean;
}

export function parseGoogleAdsError(error: any): GoogleAdsError {
  // Handle network errors
  if (!error.code) {
    return {
      code: 'network_error',
      message: 'Failed to connect to Google Ads API',
      fixSuggestions: ['Check internet connection', 'Try again in a moment'],
      userFriendly: true,
    };
  }

  // Handle specific error codes
  switch (error.code) {
    case 'PERMISSION_DENIED':
      return {
        code: 'permission_denied',
        message: 'You do not have permission to perform this action',
        fixSuggestions: [
          'Verify OAuth scopes include googleads.edit',
          'Check account access permissions in Google Ads Manager',
        ],
        userFriendly: true,
      };

    case 'QUOTA_EXCEEDED':
      return {
        code: 'quota_exceeded',
        message: 'Google Ads API rate limit exceeded',
        fixSuggestions: [
          'Wait 5 minutes before retrying',
          'Check cache to avoid duplicate requests',
        ],
        userFriendly: true,
      };

    case 'POLICY_VIOLATION':
      return {
        code: 'policy_violation',
        message: error.message || 'Campaign violates Google Ads policies',
        details: error.details,
        fixSuggestions: [
          'Review ad copy for policy violations',
          'Check landing page URL is accessible and compliant',
          'Verify targeting settings comply with policies',
        ],
        userFriendly: true,
      };

    case 'BUDGET_EXCEEDED':
      return {
        code: 'budget_exceeded',
        message: 'Account budget limit reached',
        fixSuggestions: [
          'Increase account budget in Google Ads Manager',
          'Reduce campaign budgets',
        ],
        userFriendly: true,
      };

    default:
      return {
        code: 'unknown_error',
        message: error.message || 'An unexpected error occurred',
        details: error,
        userFriendly: false,
      };
  }
}
```

---

## Retry Logic with Exponential Backoff

**File: `lib/google-ads/retry.ts`**

```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error.code === 'PERMISSION_DENIED' || error.code === 'POLICY_VIOLATION') {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay: exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
```

---

## User-Friendly Error Messages

**File: `lib/errors/user-messages.ts`**

```typescript
export function getUserFriendlyMessage(error: GoogleAdsError): string {
  if (error.userFriendly) {
    return error.message;
  }

  // Convert technical errors to user-friendly messages
  switch (error.code) {
    case 'network_error':
      return 'Unable to connect to Google Ads. Please check your internet connection.';
    case 'unknown_error':
      return 'Something went wrong. Please try again or contact support.';
    default:
      return error.message || 'An error occurred. Please try again.';
  }
}
```

---

## Error Logging

**File: `lib/errors/logger.ts`**

```typescript
export function logError(error: any, context: Record<string, any> = {}) {
  console.error('Error:', {
    code: error.code,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });

  // In production, send to error tracking service (Sentry, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: context });
  }
}
```

---

## API Route Error Handling Pattern

**Example: `app/api/campaigns/create/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { parseGoogleAdsError, retryWithBackoff } from '@/lib/google-ads/error-handler';
import { logError } from '@/lib/errors/logger';

export async function POST(request: NextRequest) {
  try {
    // ... validation ...

    const result = await retryWithBackoff(async () => {
      return await createCampaign(/* ... */);
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    logError(error, { endpoint: '/api/campaigns/create' });

    const parsedError = parseGoogleAdsError(error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: parsedError.code,
          message: parsedError.message,
          fixSuggestions: parsedError.fixSuggestions,
        },
      },
      { status: parsedError.code === 'permission_denied' ? 403 : 400 }
    );
  }
}
```

---

## Frontend Error Display

**File: `components/ErrorDisplay.tsx`**

```typescript
interface ErrorDisplayProps {
  error: {
    code: string;
    message: string;
    fixSuggestions?: string[];
  };
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="error-container">
      <h3>Error: {error.message}</h3>
      {error.fixSuggestions && error.fixSuggestions.length > 0 && (
        <ul>
          {error.fixSuggestions.map((suggestion, i) => (
            <li key={i}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Summary

1. **Parse Errors**: Convert Google Ads API errors to user-friendly format
2. **Retry Logic**: Use exponential backoff for transient errors
3. **Log Errors**: Log all errors for debugging
4. **User Messages**: Show actionable error messages with fix suggestions
5. **Error Codes**: Map technical error codes to user-friendly messages


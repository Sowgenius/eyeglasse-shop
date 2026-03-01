/**
 * API Fetch wrapper with logging
 * Wraps fetch to add automatic request/response logging
 */

import { logger, logApiRequest } from './logger';

/**
 * Get URL string from RequestInfo | URL
 */
function getUrlString(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

/**
 * Custom fetch with logging
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = getUrlString(input);
  const startTime = Date.now();
  
  logger.debug(`API Request: ${init?.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(input, init);
    const duration = Date.now() - startTime;
    
    logApiRequest(url, init, response);
    
    logger.debug(`API Response: ${response.status} (${duration}ms)`);
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`API Error: ${url} (${duration}ms)`, { error });
    throw error;
  }
}

/**
 * Create fetch with auth token
 */
export function createAuthFetch(authToken: string) {
  return (input: RequestInfo | URL, init?: RequestInit) => {
    return apiFetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${authToken}`,
      },
    });
  };
}

export default apiFetch;

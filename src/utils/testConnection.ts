/**
 * Test connection to backend server
 */

import config from '../config/env';

export async function testBackendConnection(): Promise<{success: boolean; message: string}> {
  const baseUrl = config.API_BASE_URL.replace('/api', '');
  
  try {
    // Try quick health check first (fastest)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for quick check
    
    let response: Response;
    try {
      response = await fetch(`${baseUrl}/health-quick`, {
        method: 'GET',
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return {
          success: false,
          message: `❌ Connection timeout to ${baseUrl} - server may be unreachable or firewall is blocking`,
        };
      }
      throw fetchError;
    }
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return {
        success: true,
        message: `✅ Server is reachable at ${baseUrl}!`,
      };
    } else {
      return {
        success: false,
        message: `❌ Server responded with status ${response.status}`,
      };
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: `❌ Connection timeout to ${baseUrl} - server may be unreachable or firewall is blocking`,
      };
    }
    return {
      success: false,
      message: `❌ Connection failed to ${baseUrl}: ${error.message || 'Unknown error'}`,
    };
  }
}


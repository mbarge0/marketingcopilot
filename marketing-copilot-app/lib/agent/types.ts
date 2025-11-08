/**
 * Agent Context Types
 * Context passed to tools for user-specific operations
 */

export interface AgentContext {
  userId: string;
  accountId?: string;
  customerId?: string;
}


/**
 * Agent Test Runner
 * 
 * Tests all prompts from test-prompts.json by calling invokeAgent directly.
 * Provides clear, readable output showing which prompts pass/fail.
 * Outputs results to both console and a markdown file.
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get __dirname for ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from marketing-copilot-app directory (where we run from)
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Check for required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('\n❌ ERROR: OPENAI_API_KEY is not set!');
  console.error('Please add OPENAI_API_KEY to your .env.local file.\n');
  process.exit(1);
}

import { readFileSync, writeFileSync } from 'fs';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, ToolMessage } from '@langchain/core/messages';
import {
  getCampaignReport,
  createCampaignEntity,
  refreshDataTool,
  analyzePerformance
} from '../../lib/agent/tools';

// Load test prompts (relative to this file's directory)
const promptsPath = resolve(__dirname, 'test-prompts.json');
const testPrompts = JSON.parse(readFileSync(promptsPath, 'utf-8')) as Record<string, string[]>;

// Test results tracking
interface TestResult {
  tool: string; // Expected tool (from test category)
  actualToolCalled?: string; // Actual tool that was called
  promptNumber: number;
  prompt: string;
  success: boolean;
  response?: string;
  error?: string;
  duration: number;
}

// Create agent instance for testing
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const agent = createReactAgent({
  llm,
  tools: [
    getCampaignReport,
    createCampaignEntity,
    refreshDataTool,
    analyzePerformance
  ],
  prompt: `You are a marketing performance assistant for cross-channel campaign management. You help users analyze and understand their Google Ads and Meta Ads performance.

You have access to these tools:

1. get_campaign_report - For reporting and performance metrics
   Use when: User asks for /report commands, performance metrics, spend, ROAS, conversions, impressions, clicks, campaign performance data
   Example: "/report spend, ROAS last 7d", "show me campaign metrics", "what's my spend and conversions?"

2. create_campaign_entity - For creating campaigns, adsets, ads, or budgets
   Use when: User asks for /create commands, creating campaigns, creating adsets, creating ads, setting budgets, campaign creation
   Example: "/create campaign 'Summer Sale' budget $5000 on Google", "create a new adset", "set budget for campaign"

3. refresh_data - For refreshing and syncing cached data
   Use when: User asks for /refresh commands, refreshing data, syncing data, updating cache, getting latest metrics
   Example: "/refresh data for last 30 days", "sync my campaign data", "update the cache"

4. analyze_performance - For analyzing performance and providing insights
   Use when: User asks for /analyze commands, analyzing performance, why did performance change, root cause analysis, anomaly detection, performance insights
   Example: "/analyze why did ROAS drop yesterday?", "analyze performance", "what's causing the CPA increase?"

Tool Selection Guidelines:
- Use get_campaign_report for general reporting and performance metrics
- Use create_campaign_entity for creating campaigns, adsets, ads, or budgets
- Use refresh_data for syncing and refreshing cached data from APIs
- Use analyze_performance for analyzing performance, detecting anomalies, and providing insights

Always use tools when you need real-time campaign data. Answer general marketing questions directly without tools.

When presenting results:
- Summarize key findings in natural language
- Highlight important metrics and comparisons
- Explain any anomalies or significant changes
- Suggest follow-up actions when relevant
- For create operations, confirm the entity was created with details
- For refresh operations, summarize what was updated`
});

// Wrapper function to invoke agent and capture tool calls
async function invokeAgentWithToolTracking(messages: any[]): Promise<{ response: string; toolsCalled: string[] }> {
  const result = await agent.invoke({ messages });
  
  // Extract tool calls from messages
  const toolsCalled: string[] = [];
  if (result.messages) {
    for (const message of result.messages) {
      const msgType = (message as any).getType?.() || (message as any).lc_kwargs?.type || (message as any).type;
      
      // Check if it's a ToolMessage (indicates a tool was called and returned)
      if (msgType === 'tool' || message instanceof ToolMessage) {
        // ToolMessage has the tool name in its structure
        const toolName = (message as any).name || 
                       (message as any).lc_kwargs?.name ||
                       (message as any).tool_call_id?.split('_')[0];
        if (toolName && !toolsCalled.includes(toolName)) {
          toolsCalled.push(toolName);
        }
      }
      
      // Check for AIMessage with tool_calls (when agent decides to call a tool)
      if (msgType === 'ai' || msgType === 'AIMessage') {
        const toolCalls = (message as any).tool_calls || 
                         (message as any).lc_kwargs?.tool_calls ||
                         (message as any).additional_kwargs?.tool_calls;
        if (toolCalls && Array.isArray(toolCalls)) {
          for (const toolCall of toolCalls) {
            const toolName = toolCall.name || toolCall.function?.name;
            if (toolName && !toolsCalled.includes(toolName)) {
              toolsCalled.push(toolName);
            }
          }
        }
      }
      
      // Also check the raw message structure
      if ((message as any).lc_kwargs) {
        const kwargs = (message as any).lc_kwargs;
        if (kwargs.tool_calls) {
          for (const toolCall of kwargs.tool_calls) {
            const toolName = toolCall.name || toolCall.function?.name;
            if (toolName && !toolsCalled.includes(toolName)) {
              toolsCalled.push(toolName);
            }
          }
        }
      }
    }
  }
  
  // Extract final response
  const lastMessage = result.messages[result.messages.length - 1];
  const response = (lastMessage as any).content || 
                  (lastMessage as any).lc_kwargs?.content ||
                  "No response generated";
  
  return {
    response: typeof response === 'string' ? response : String(response),
    toolsCalled
  };
}

const results: TestResult[] = [];

// Helper to format output
function formatSection(title: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`  ${title}`);
  console.log('='.repeat(80));
}

function formatTestResult(result: TestResult) {
  const status = result.success ? '✓' : '✗';
  const statusColor = result.success ? '\x1b[32m' : '\x1b[31m'; // Green or Red
  const reset = '\x1b[0m';
  
  console.log(`\n${statusColor}${status}${reset} Test ${result.promptNumber}: ${result.tool}`);
  console.log(`   Prompt: "${result.prompt}"`);
  console.log(`   Duration: ${result.duration}ms`);
  
  if (result.actualToolCalled) {
    const toolMatch = result.actualToolCalled === result.tool ? '✓' : '✗';
    const toolColor = result.actualToolCalled === result.tool ? '\x1b[32m' : '\x1b[33m'; // Green or Yellow
    console.log(`   ${toolColor}Tool Called: ${result.actualToolCalled}${reset} ${toolMatch} (Expected: ${result.tool})`);
  } else {
    console.log(`   Tool Called: None (Expected: ${result.tool})`);
  }
  
  if (result.success) {
    const preview = result.response?.substring(0, 150) || '';
    const ellipsis = (result.response?.length || 0) > 150 ? '...' : '';
    console.log(`   Response: ${preview}${ellipsis}`);
  } else {
    console.log(`   Error: ${result.error}`);
  }
}

// Run tests for a specific tool
async function runToolTests(toolName: string, prompts: string[]) {
  formatSection(`Testing ${toolName}`);
  
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const startTime = Date.now();
    
    try {
      const message = new HumanMessage(prompt);
      const { response, toolsCalled } = await invokeAgentWithToolTracking([message]);
      const duration = Date.now() - startTime;
      
      const result: TestResult = {
        tool: toolName,
        actualToolCalled: toolsCalled.length > 0 ? toolsCalled[0] : undefined,
        promptNumber: i + 1,
        prompt,
        success: true,
        response: typeof response === 'string' ? response : String(response),
        duration
      };
      
      results.push(result);
      formatTestResult(result);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        tool: toolName,
        actualToolCalled: undefined,
        promptNumber: i + 1,
        prompt,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration
      };
      
      results.push(result);
      formatTestResult(result);
    }
    
    // Small delay between tests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Generate markdown report
function generateMarkdownReport(totalTime: number): string {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  
  const byTool: Record<string, { total: number; passed: number; failed: number }> = {};
  
  results.forEach(result => {
    if (!byTool[result.tool]) {
      byTool[result.tool] = { total: 0, passed: 0, failed: 0 };
    }
    byTool[result.tool].total++;
    if (result.success) {
      byTool[result.tool].passed++;
    } else {
      byTool[result.tool].failed++;
    }
  });
  
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const timestamp = new Date().toISOString();
  
  let markdown = `# Agent Test Results\n\n`;
  markdown += `**Generated:** ${timestamp}\n`;
  markdown += `**Total Execution Time:** ${(totalTime / 1000).toFixed(2)}s\n\n`;
  
  markdown += `## Summary\n\n`;
  markdown += `| Metric | Value |\n`;
  markdown += `|--------|-------|\n`;
  markdown += `| Total Tests | ${totalTests} |\n`;
  markdown += `| Passed | ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%) |\n`;
  markdown += `| Failed | ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%) |\n`;
  markdown += `| Average Response Time | ${avgDuration.toFixed(0)}ms |\n\n`;
  
  markdown += `## Results by Tool\n\n`;
  markdown += `| Tool | Total | Passed | Failed | Pass Rate |\n`;
  markdown += `|------|-------|--------|--------|-----------|\n`;
  Object.entries(byTool).forEach(([tool, stats]) => {
    const passRate = ((stats.passed / stats.total) * 100).toFixed(1);
    markdown += `| ${tool} | ${stats.total} | ${stats.passed} | ${stats.failed} | ${passRate}% |\n`;
  });
  markdown += `\n`;
  
  // Tool accuracy summary
  const toolAccuracy: Record<string, { correct: number; incorrect: number; none: number; total: number }> = {};
  results.forEach(result => {
    if (!toolAccuracy[result.tool]) {
      toolAccuracy[result.tool] = { correct: 0, incorrect: 0, none: 0, total: 0 };
    }
    toolAccuracy[result.tool].total++;
    if (result.actualToolCalled) {
      if (result.actualToolCalled === result.tool) {
        toolAccuracy[result.tool].correct++;
      } else {
        toolAccuracy[result.tool].incorrect++;
      }
    } else {
      toolAccuracy[result.tool].none++;
    }
  });
  
  markdown += `## Tool Selection Accuracy\n\n`;
  markdown += `| Expected Tool | Correct | Incorrect | None | Accuracy |\n`;
  markdown += `|---------------|---------|-----------|------|----------|\n`;
  Object.entries(toolAccuracy).forEach(([tool, stats]) => {
    const accuracy = ((stats.correct / stats.total) * 100).toFixed(1);
    markdown += `| ${tool} | ${stats.correct} | ${stats.incorrect} | ${stats.none} | ${accuracy}% |\n`;
  });
  markdown += `\n`;
  
  // Test results by tool
  markdown += `## Detailed Results\n\n`;
  for (const [toolName, toolResults] of Object.entries(
    results.reduce((acc, r) => {
      if (!acc[r.tool]) acc[r.tool] = [];
      acc[r.tool].push(r);
      return acc;
    }, {} as Record<string, TestResult[]>)
  )) {
    markdown += `### ${toolName}\n\n`;
    toolResults.forEach((result, idx) => {
      const status = result.success ? '✅' : '❌';
      markdown += `#### Test ${result.promptNumber}: ${status}\n\n`;
      markdown += `**Prompt:**\n\`\`\`\n${result.prompt}\n\`\`\`\n\n`;
      markdown += `**Duration:** ${result.duration}ms\n\n`;
      
      // Show tool call information
      if (result.actualToolCalled) {
        const toolMatch = result.actualToolCalled === result.tool;
        const matchStatus = toolMatch ? '✅' : '⚠️';
        markdown += `**Tool Called:** \`${result.actualToolCalled}\` ${matchStatus}\n`;
        markdown += `**Expected Tool:** \`${result.tool}\`\n\n`;
      } else {
        markdown += `**Tool Called:** None\n`;
        markdown += `**Expected Tool:** \`${result.tool}\`\n\n`;
      }
      
      if (result.success) {
        markdown += `**Response:**\n\`\`\`\n${result.response}\n\`\`\`\n\n`;
      } else {
        markdown += `**Error:**\n\`\`\`\n${result.error}\n\`\`\`\n\n`;
      }
      markdown += `---\n\n`;
    });
  }
  
  // Failed tests summary
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    markdown += `## Failed Tests Summary\n\n`;
    failed.forEach(result => {
      markdown += `- **${result.tool}** - Test ${result.promptNumber}: "${result.prompt}"\n`;
      markdown += `  - Error: ${result.error}\n\n`;
    });
  }
  
  return markdown;
}

// Generate summary report
function generateSummary() {
  formatSection('Test Summary');
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  
  const byTool: Record<string, { total: number; passed: number; failed: number }> = {};
  
  results.forEach(result => {
    if (!byTool[result.tool]) {
      byTool[result.tool] = { total: 0, passed: 0, failed: 0 };
    }
    byTool[result.tool].total++;
    if (result.success) {
      byTool[result.tool].passed++;
    } else {
      byTool[result.tool].failed++;
    }
  });
  
  console.log(`\nOverall Results:`);
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log(`  Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`);
  
  console.log(`\nBy Tool:`);
  Object.entries(byTool).forEach(([tool, stats]) => {
    const passRate = ((stats.passed / stats.total) * 100).toFixed(1);
    console.log(`  ${tool}:`);
    console.log(`    Total: ${stats.total}`);
    console.log(`    Passed: ${stats.passed} (${passRate}%)`);
    console.log(`    Failed: ${stats.failed}`);
  });
  
  // Show failed tests
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log(`\nFailed Tests:`);
    failed.forEach(result => {
      console.log(`  ${result.tool} - Test ${result.promptNumber}: "${result.prompt}"`);
      console.log(`    Error: ${result.error}`);
    });
  }
  
  // Average duration
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  console.log(`\nPerformance:`);
  console.log(`  Average Response Time: ${avgDuration.toFixed(0)}ms`);
  console.log(`  Total Test Time: ${results.reduce((sum, r) => sum + r.duration, 0)}ms`);
}

// Main test runner
async function runAllTests() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    Agent Test Runner - Direct Function Tests                 ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  
  const startTime = Date.now();
  
  // Run tests for each tool
  for (const [toolName, prompts] of Object.entries(testPrompts)) {
    await runToolTests(toolName, prompts);
  }
  
  const totalTime = Date.now() - startTime;
  
  // Generate summary
  generateSummary();
  
  // Generate and save markdown report
  const markdownReport = generateMarkdownReport(totalTime);
  const reportPath = resolve(__dirname, 'test-results.md');
  writeFileSync(reportPath, markdownReport, 'utf-8');
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Total execution time: ${totalTime}ms`);
  console.log(`Markdown report saved to: ${reportPath}`);
  console.log(`${'='.repeat(80)}\n`);
  
  // Exit with appropriate code
  const failedCount = results.filter(r => !r.success).length;
  process.exit(failedCount > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('\nFatal error running tests:', error);
  process.exit(1);
});


import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import type { BaseMessage } from "@langchain/core/messages";
import {
  getCampaignReport,
  createCampaignEntity,
  refreshDataTool,
  analyzePerformance
} from "./tools";

console.log("\n=== Agent Module Loading ===");
console.log("LangSmith API Key:", process.env.LANGSMITH_API_KEY ? "SET" : "NOT SET");
console.log("LangSmith Project:", process.env.LANGSMITH_PROJECT || "NOT SET");

// Create agent once (v1.0 API)
console.log("Creating ChatOpenAI LLM...");
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

console.log("Creating LangGraph agent with tools...");
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
IMPORTANT: For /report and /analyze commands, include the raw JSON data from the tool in your response wrapped in a code block.
The system will automatically parse it to create visual charts and tables.

Format your responses as follows:
1. First, include the JSON data in a code block (this will be hidden from the user but used for visualization)
2. Then, provide a brief, natural language summary

Example for reports:
\`\`\`json
{tool data here}
\`\`\`
Here's your performance report for the last 7 days. Your Google Ads campaigns generated $1,250 in spend with a 3.0x ROAS and 45 conversions. Meta Ads spent $1,800 with a 2.8x ROAS and 62 conversions. Overall, both channels are performing well.

Example for analysis:
\`\`\`json
{tool data here}
\`\`\`
I've analyzed the performance drop. Yesterday (Nov 7), Google Ads ROAS fell 18% from 2.9x to 2.6x. The main culprit was a 41% spike in CPC combined with a 33% drop in conversion rate. I recommend reviewing your bid adjustments and checking for ad fatigue.

Keep your summaries concise and conversational - avoid repeating all the numbers since they'll be displayed visually.`
});
console.log("Agent created successfully");
console.log("===========================\n");

// Agent invocation helper
export async function invokeAgent(messages: BaseMessage[] | any[]): Promise<string> {
  console.log("\n--- Agent Invocation Start ---");
  console.log("Input messages count:", messages.length);
  
  // Note: System prompt is now handled by createReactAgent's prompt parameter
  // We still inject messages directly
  console.log("Messages:", JSON.stringify(messages, null, 2));
  
  try {
    console.log("Calling agent.invoke()...");
    const startTime = Date.now();
    
    const result = await agent.invoke({
      messages: messages
    });
    
    const duration = Date.now() - startTime;
    console.log("Agent invoke completed in", duration, "ms");
    console.log("Result keys:", Object.keys(result));
    console.log("Result messages count:", result.messages?.length || 0);
    console.log("Result messages:", JSON.stringify(result.messages, null, 2));
    
    // Extract final response
    const lastMessage = result.messages[result.messages.length - 1];
    const response = (lastMessage as any).content || "No response generated";
    
    console.log("Extracted response:", response);
    console.log("Last message type:", lastMessage.constructor?.name || typeof lastMessage);
    console.log("--- Agent Invocation End ---\n");
    
    return typeof response === 'string' ? response : String(response);
  } catch (error) {
    console.error("\n--- ERROR in invokeAgent ---");
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : undefined);
    console.error("Error name:", error instanceof Error ? error.name : undefined);
    if (error instanceof Error) {
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
    console.error("----------------------------\n");
    throw error;
  }
}


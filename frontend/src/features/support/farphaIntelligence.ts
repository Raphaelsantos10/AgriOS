import {
  farphaIntelligenceRepository,
  type FarphaIntelligenceContext,
} from "../../repositories/intelligence/farphaIntelligenceRepository";
export {
  currentIntelligenceContext,
  intelligenceErrorMessage,
} from "./farphaIntelligenceUtils";

export const FARPHA_AI_CONVERSATION_KEY = "farpha-ai-conversation-v1";

export async function askFarphaIntelligence(
  message: string,
  conversationId: string | undefined,
  context: FarphaIntelligenceContext,
) {
  return farphaIntelligenceRepository.ask({
    message: message.trim().slice(0, 2000),
    conversationId,
    context,
  });
}

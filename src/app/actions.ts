"use server";

import {
  generatePersonalizedRecommendations,
  type PersonalizedRecommendationsInput,
} from "@/ai/flows/generate-personalized-recommendations";
import {
  agent,
} from "@/ai/flows/agent";
import type { SemanticSearchInput } from "@/types/ai";


export async function getRecommendations(
  input: PersonalizedRecommendationsInput
) {
  try {
    const recommendations = await generatePersonalizedRecommendations(input);
    return { success: true, data: recommendations };
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return {
      success: false,
      error: "We couldn't generate recommendations at this time. Please try again later.",
    };
  }
}

export async function searchContent(input: SemanticSearchInput) {
  try {
    const results = await agent(input);
    return { success: true, data: results };
  } catch (error) {
    console.error("Error performing semantic search:", error);
    return {
      success: false,
      error: "We couldn't perform the search at this time. Please try again later.",
    };
  }
}

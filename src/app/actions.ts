"use server";

import {
  generatePersonalizedRecommendations,
  type PersonalizedRecommendationsInput,
} from "@/ai/flows/generate-personalized-recommendations";
import {
  agent,
} from "@/ai/flows/agent";
import {
  textToSpeech,
} from "@/ai/flows/text-to-speech";
import type { SemanticSearchInput } from "@/types/ai";
import { findContentAvailability, type FindContentAvailabilityInput } from "@/ai/flows/find-content-availability";


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

export async function getSpeech(text: string) {
    try {
        const result = await textToSpeech(text);
        return { success: true, data: result.media };
    } catch (error) {
        console.error("Error generating speech:", error);
        return {
        success: false,
        error: "We couldn't generate speech at this time. Please try again later.",
        };
    }
}

export async function getContentAvailability(input: FindContentAvailabilityInput) {
  try {
    const results = await findContentAvailability(input);
    return { success: true, data: results };
  } catch (error) {
    console.error("Error finding content availability:", error);
    return {
      success: false,
      error: "We couldn't find availability at this time. Please try again later.",
    };
  }
}

"use server";

import {
  generatePersonalizedRecommendations,
  type PersonalizedRecommendationsInput,
} from "@/ai/flows/generate-personalized-recommendations";

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

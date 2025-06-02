const API_URL = "http://localhost:8000/api";

export async function generateWorkoutPlan(planData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  try {
    const response = await fetch(`${API_URL}/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(planData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to generate workout plan");
    }
    
    return result;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw error;
  }
}

export async function getAllWorkoutPlans() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  try {
    const response = await fetch(`${API_URL}/all-plans`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch workout plans");
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching workout plans:", error);
    throw error;
  }
}

export async function chatWithAI(message, planId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message, planId })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to chat with AI");
    }
    return result;
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw error;
  }
} 
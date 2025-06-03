const API_URL = "http://localhost:8000/api/settings";

export async function fetchSettings() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await fetch(`${API_URL}/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch settings");
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching settings", error);
    throw error;
  }
}

export async function saveSettings(settingsData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  try {
    const response = await fetch(`${API_URL}/save`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ settings: settingsData })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to save settings");
    }
    
    return result;
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
} 
const API_URL = "http://localhost:8000/api";

export async function getExercises(params) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_URL}/exercises?${new URLSearchParams(params)}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}
import apiRequest from "./apiClient";

export function loginUser(data) {
  return apiRequest("/users/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


const API_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getRepositories() {
  return request("/repositories");
}

export function getRepository(id) {
  return request(`/repositories/${id}`);
}

export function createRepository(repository) {
  return request("/repositories", {
    method: "POST",
    body: JSON.stringify(repository),
  });
}

export function updateRepository(id, repository) {
  return request(`/repositories/${id}`, {
    method: "PUT",
    body: JSON.stringify(repository),
  });
}

export function deleteRepository(id) {
  return request(`/repositories/${id}`, {
    method: "DELETE",
  });
}
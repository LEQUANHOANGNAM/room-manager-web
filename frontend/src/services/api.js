const API_URL = "http://localhost:5000/api";

// ================= HELPER =================
function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders(isJson = true) {
  const token = getToken();
  return {
    ...(isJson && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ================= AUTH =================
export async function loginApi(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseJson(res);
}

export async function getMe() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(false),
  });
  return parseJson(res);
}

export async function logoutApi() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(false),
  });
  // 204 No Content
  if (res.status === 204) return null;
  return parseJson(res);
}

// ================= ROOM =================
export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`, {
    headers: getAuthHeaders(false),
  });
  return parseJson(res);
}

// CREATE ROOM
export async function createRoomApi(formData) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  return parseJson(res);
}

// UPDATE ROOM
export async function updateRoomApi(id, formData) {
  const res = await fetch(`${API_URL}/rooms/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  return parseJson(res);
}

// DELETE
export async function deleteRoomApi(id) {
  const res = await fetch(`${API_URL}/rooms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(false),
  });
  return parseJson(res);
}

// ================= PAYMENT =================
export async function getPayments() {
  const res = await fetch(`${API_URL}/payments`, {
    headers: getAuthHeaders(false),
  });
  return parseJson(res);
}

// ================= CHAT =================
export async function chatApi(question) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ question }),
  });
  return parseJson(res);
}

export async function createBill() {
  const res = await fetch(`${API_URL}/payments/testCreateBill`, {
    method: "POST",
    headers: getAuthHeaders(false),
  });
  return parseJson(res);
}

export async function sendReminder() {
  const res = await fetch(`${API_URL}/payments/testSendReminder`, {
    method: "POST",
    headers: getAuthHeaders(false),
  });
  return parseJson(res);
}

export async function payBillApi(id) {
  const res = await fetch(`${API_URL}/payments/${id}/pay`, {
    method: "PUT",
    headers: getAuthHeaders(false),
  });
  return parseJson(res);
}

export async function updateUsageApi(id, data) {
  const res = await fetch(`${API_URL}/payments/${id}/usage`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(data),
  });
  return parseJson(res);
}

export async function deletePaymentApi(id) {
  const res = await fetch(`${API_URL}/payments/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(false),
  });
  return parseJson(res);
}

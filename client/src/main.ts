// Base URL pointing to your Vite proxy prefix
const API_BASE_URL = "/api";

const fetchBtn = document.getElementById("fetch-btn") as HTMLButtonElement;
const outputEl = document.getElementById("output") as HTMLPreElement;
const statusEl = document.getElementById("status-indicator") as HTMLDivElement;

/**
 * Feches a page of invoice data from the backend Express server via the Vite proxy.
 */
async function loadInvoices(
  page: number = 1,
  limit: number = 5,
): Promise<void> {
  try {
    fetchBtn.disabled = true;
    statusEl.textContent = "Fetching telemetry-tracked data...";
    statusEl.style.color = "#2563eb";
    outputEl.textContent = "// Awaiting response stream...";

    const response = await fetch(
      `${API_BASE_URL}/invoices?page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    outputEl.textContent = JSON.stringify(data, null, 2);
    statusEl.textContent = `Success! Clean 200 OK received at ${new Date().toLocaleTimeString()}`;
    statusEl.style.color = "#16a34a";
  } catch (error) {
    statusEl.textContent = "Failed to communicate with API server.";
    statusEl.style.color = "#dc2626";
    outputEl.textContent = JSON.stringify(
      {
        error: "Network or Server Failure",
        message: error instanceof Error ? error.message : String(error),
        suggestion:
          "Ensure the Express server is running on port 3000 and Turbo dev is active.",
      },
      null,
      2,
    );
  } finally {
    fetchBtn.disabled = false;
  }
}

fetchBtn.addEventListener("click", () => {
  const randomPage = Math.floor(Math.random() * 5) + 1;
  loadInvoices(randomPage, 5);
});

import express from "express";
import pino from "pino";
import { pinoHttp } from "pino-http";
import { createStream } from "pino-seq";

const seqStream = createStream({ serverUrl: "http://127.0.0.1:5341" });
const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
  },
  seqStream,
);

const app = express();
const PORT = 3000;

app.use(pinoHttp({ logger }));

const MOCK_INVOICES = Array.from({ length: 50 }, (_, i) => ({
  id: `INV-2026-${String(i + 1).padStart(3, "0")}`,
  client: `Client Company ${String.fromCharCode(65 + (i % 6))}`,
  amount: parseFloat((Math.random() * 5000 + 500).toFixed(2)),
  status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Overdue",
  editableFields: {
    notes: "Standard net-30 terms apply.",
    reviewed: i % 2 === 0,
  },
}));

/**
 * Health Check
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Paginated Invoices Endpoint
 */
app.get("/api/invoices", (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  req.log.info({ page, limit }, "Fetching paginated invoices");

  const results = MOCK_INVOICES.slice(startIndex, endIndex);

  res.status(200).json({
    page,
    limit,
    totalRecords: MOCK_INVOICES.length,
    totalPages: Math.ceil(MOCK_INVOICES.length / limit),
    data: results,
  });
});

app.listen(PORT, () => {
  logger.info(`API running at http://localhost:${PORT}`);
});

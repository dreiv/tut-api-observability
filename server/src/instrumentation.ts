import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

// Tell the OTel SDK to stream traces straight to our custom 'tel' Express collector
const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const sdk = new NodeSDK({
  serviceName: "invoice-api-server",
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
  sdk.start();
  console.log(
    "[OTel] OpenTelemetry engine active. Forwarding streams to 'tel' server.",
  );
} catch (error) {
  console.error("[OTel] Error initializing OpenTelemetry SDK", error);
}

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("[OTel] SDK terminated successfully"))
    .catch((err) => console.log("[OTel] Error terminating SDK", err))
    .finally(() => process.exit(0));
});

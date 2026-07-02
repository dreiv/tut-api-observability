import express from "express";

const app = express();
const PORT = 4318;

app.use(express.json({ type: ["application/json", "application/x-protobuf"] }));

/**
 * OpenTelemetry OTLP Trace Receiver Endpoint
 * The OTel SDK on the server will automatically POST JSON trace spans here
 */
app.post("/v1/traces", (req, res) => {
  console.log(
    "\n====== [TEL BACKEND] RECEIVED NEW TELEMETRY TRACE BATCH ======",
  );

  const resourceSpans = req.body.resourceSpans;

  if (!resourceSpans || resourceSpans.length === 0) {
    console.log("Empty trace payload received.");
    return res.status(200).send();
  }

  resourceSpans.forEach((resourceSpan: any) => {
    const serviceNameAttr = resourceSpan.resource?.attributes?.find(
      (attr: any) => attr.key === "service.name",
    );
    const serviceName =
      serviceNameAttr?.value?.stringValue || "unknown-service";

    console.log(`\n[Service]: ${serviceName}`);

    resourceSpan.scopeSpans?.forEach((scopeSpan: any) => {
      scopeSpan.spans?.forEach((span: any) => {
        const durationNs =
          BigInt(span.endTimeUnixNano || 0) -
          BigInt(span.startTimeUnixNano || 0);
        const durationMs = Number(durationNs) / 1_000_000;

        console.log(`  -> [Span]: ${span.name}`);
        console.log(`     Trace ID: ${span.traceId}`);
        console.log(`     Span ID:  ${span.spanId}`);
        console.log(`     Duration: ${durationMs.toFixed(2)}ms`);

        const httpMethod = span.attributes?.find(
          (a: any) =>
            a.key === "http.request.method" || a.key === "http.method",
        )?.value?.stringValue;
        const httpRoute = span.attributes?.find(
          (a: any) => a.key === "http.route" || a.key === "http.target",
        )?.value?.stringValue;
        const statusCode = span.attributes?.find(
          (a: any) =>
            a.key === "http.response.status_code" ||
            a.key === "http.status_code",
        )?.value?.intValue;

        if (httpMethod || httpRoute) {
          console.log(
            `     HTTP Details: [${httpMethod || "GET"}] ${httpRoute || "/"} -> Status ${statusCode || 200}`,
          );
        }
      });
    });
  });

  console.log(
    "=============================================================\n",
  );

  // OTLP requires returning a clean 200 OK status code back to the SDK exporter
  res.status(200).send();
});

app.listen(PORT, () => {
  console.log(
    `Custom Telemetry Collector [tel] running on http://localhost:${PORT}`,
  );
});

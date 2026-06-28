const express = require("express");
const app = express();
//best for parsig stream csv --> json
const csv = require("csv-parser");

app.post("/upload-csv", (req, res) => {
  let rowCount = 0;

  console.log(
    "✈️  Incoming CSV network stream detected. Processing mid-flight...",
  );

  // 1. Pipe the raw request stream directly into the CSV parser transform stream
  req
    .pipe(csv())

    // 2. This event fires the moment a complete row is assembled from the current binary chunks
    .on("data", (rowJSON) => {
      rowCount++;

      // 'rowJSON' is already a clean JavaScript/JSON object!
      // Example: { id: '101', name: 'Alice', role: 'Admin' }

      // PRODUCTION TIP: Instead of pushing to an array (which loads RAM),
      // you would stream this row straight into a database batch command here.
      if (rowCount <= 3) {
        console.log(`📦 Processed Row #${rowCount} to JSON:`, rowJSON);
      }
    })

    // 3. This event fires when the network stream cleanly finishes transmitting
    .on("end", () => {
      console.log(
        `🏁 Network stream closed. Successfully processed ${rowCount} rows.`,
      );

      res.status(200).json({
        success: true,
        message: "CSV streamed and parsed successfully!",
        totalRowsProcessed: rowCount,
      });
    })

    // 4. Always listen for stream errors (e.g., client suddenly disconnects)
    .on("error", (err) => {
      console.error("❌ Stream pipeline failed:", err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: "Stream parsing crashed." });
      }
    });
});
app.post("/upload-csv", (req, res) => {
  req
    .pipe(csv())
    .on("data", (jsonRowData) => {
      console.log("jsonRow>>", {
        number: jsonRowData.Number,
        footnote: jsonRowData.Footnote.slice(0, 100),
      });
      console.log();
      console.log();
    })
    .on("end", () => {
      res.status(200).send("success");
    })
    .on("error", (error) => {
      res.status(500).send(error);
    });
});

app.listen(4001, () => {
  console.log(`Server is listening on 4001`);
});

const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.get("/", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Stream Uploader Lab</title>
        <style>
          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #121212; color: white; margin: 0; }
          .card { background: #1e1e1e; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); text-align: center; }
          input, button { margin-top: 15px; padding: 10px; font-size: 16px; width: 100%; box-sizing: border-box; border-radius: 4px; border: none; }
          button { background: #007bff; color: white; cursor: pointer; font-weight: bold; }
          button:hover { background: #0056b3; }
          #status { margin-top: 15px; color: #00ff88; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🚀 Stream Uploader Lab</h2>
          <p>Pick any large file to stream it directly to disk.</p>
          <input type="file" id="filePicker" />
          <button onclick="uploadFile()">Upload File</button>
          <div id="status"></div>
        </div>
  
        <script>
          async function uploadFile() {
            const picker = document.getElementById('filePicker');
            const statusDiv = document.getElementById('status');
            if (!picker.files.length) {
              alert('Please select a file first!');
              return;
            }
  
            const file = picker.files[0];
            statusDiv.innerText = 'Streaming file chunks to server... 📦';
  
            try {
              // Fetch API lets us send the raw binary payload directly in the body
              const response = await fetch('/upload', {
                method: 'POST',
                headers: { 
                  // We send the original filename in headers so the backend knows what it is
                 'x-file-name': file.name 
                },
                body: file // 👈 Sends the raw file stream directly!
              });
  
              const result = await response.json();
              statusDiv.innerText = '🏁 ' + result.message + ' -> ' + result.file;
            } catch (err) {
              statusDiv.innerText = '❌ Upload failed.';
            }
          }
        </script>
      </body>
      </html>
    `);
});

// If your client is sending a raw file, the browser sets the Content-Type to
// something like application/pdf or application/octet-stream. When express.json()
// looks at that header, it says, "Nope, this isn't JSON data," and it completely skips parsing it.
// It just calls next() immediately without touching the body. That is why req.body is empty!
app.use(express.json());

app.post("/upload", (req, res, next) => {
  const filename = req.headers["x-file-name"];
  const destination = path.join(__dirname, "uploads", `server-${filename}`);

  if (!fs.existsSync(path.dirname(destination))) {
    fs.mkdirSync(path.dirname(destination));
  }
  const writeStream = fs.createWriteStream(destination);
  req.pipe(writeStream);
  writeStream.on("finish", () => {
    res.status(201).json({ message: "file uploaded success", file: filename });
  });
});
app.listen(4001, () => {
  console.log("server is listening on 4001");
});

const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.get("/", (req, res) => {
  // res.setHeader("X-Frame-Options", "SAMEORIGIN"); // use only incase of "DENY" or "SAMEORIGIN"
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors http://localhost:3000",
  ); // allow iframing only from localhost:3000. 4001 and 8000 will be blocked
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

              const response = await fetch('http://localhost:4001/upload', {
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

app.get("/iframing", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Iframe Demo</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          iframe {
            width: 100%;
            height: 100vh;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="http://localhost:4001">hi</iframe>
      </body>
    </html>
  `);
});

// If your client is sending a raw file, the browser sets the Content-Type to
// something like application/pdf or application/octet-stream. When express.json()
// looks at that header, it says, "Nope, this isn't JSON data," and it completely skips parsing it.
// It just calls next() immediately without touching the body. That is why req.body is empty!
app.use(express.json());

app.use((req, res, next) => {
  // 1. Set the origins allowed to access your API
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // 2. Specify allowed HTTP methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  // 3. Explicitly list your custom request headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Custom-Header, x-file-name",
  );

  // Cache preflight results in the browser for 1 minute (60 seconds)
  // res.setHeader("Access-Control-Max-Age", "60");

  // // 4. Intercept the browser preflight OPTIONS request. Preflight only runs for POST, PATCH, DELETE Request
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Respond immediately with "No Content" and stop
  }

  // 5. Pass control to the next route handler for standard requests
  next();
});

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

app.get("/health", (req, res, next) => {
  res.status(200).json("GOOD");
});

app.get("/health-page", (req, res, next) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Health Check Dashboard</title>
        <style>
            body { font-family: sans-serif; margin: 40px; }
            button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
            #result { margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px; display: none; }
        </style>
    </head>
    <body>

        <h1>Server Health Dashboard</h1>
        <button id="check-btn">Check Server Health</button>
        
        <!-- This container will display the health data -->
        <div id="result"></div>

        <script>
            document.getElementById('check-btn').addEventListener('click', async () => {
                const resultDiv = document.getElementById('result');
                resultDiv.style.display = 'block';
                resultDiv.innerText = 'Fetching health status...';

                try {
                    // Makes the cross-origin GET request to port 4001
                    const response = await fetch('http://localhost:4001/health');
                    console.log('res', response);
                    
                    if (!response.ok) {
                        throw new Error('Server responded with status: ' + response.status);
                    }

                    const data = await response.json();
                    
                    // Displays the formatted JSON payload on the screen
                    resultDiv.innerHTML = '<strong>Status:</strong> <pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    resultDiv.innerHTML = '<span style="color: red;"><strong>Error:</strong> ' + error.message + '</span>';
                }
            });
        </script>

    </body>
    </html>
  `);
});

app.listen(4001, () => {
  console.log("server is listening on 4001");
});
app.listen(3000, () => {
  console.log("server is listening on 3000");
});
app.listen(8000, () => {
  console.log("server is listening on 8000");
});

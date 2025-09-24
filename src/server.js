import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pinoHttp from "pino-http";


dotenv.config();

const PORT = process.env.PORT || 3030; 
const app = express();


app.use(cors()); 
app.use(express.json());
app.use(pinoHttp()); 


app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get("/test-error", () => {
  throw new Error("Simulated server error");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


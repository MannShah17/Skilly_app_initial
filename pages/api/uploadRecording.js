import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://admin:admin@cluster0.fgd8xhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await client.connect();
      const database = client.db("skilly");
      const recordings = database.collection("recordings");

      const recordingData = req.body;
      const result = await recordings.insertOne(recordingData);

      res.status(200).json({
        message: "Recording uploaded successfully",
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading recording", error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

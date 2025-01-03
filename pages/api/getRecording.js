import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await client.connect();
      const database = client.db("skilly");
      const recordings = database.collection("recordings");

      const { id } = req.query;
      const recording = await recordings.findOne({ _id: new ObjectId(id) });

      if (recording) {
        res.status(200).json(recording);
      } else {
        res.status(404).json({ message: "Recording not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching recording", error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

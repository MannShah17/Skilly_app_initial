import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://admin:admin@cluster0.fgd8xhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await client.connect();
      const database = client.db("skilly");
      const recordings = database.collection("recordings");

      const allRecordings = await recordings.find({}).toArray();

      res.status(200).json(allRecordings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recordings", error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

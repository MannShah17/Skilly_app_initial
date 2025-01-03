import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserDashboard() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch("/api/getAllRecordings");
      const data = await response.json();
      setVideos(data);
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      <ul>
        {videos.map((video) => (
          <li key={video._id}>
            <Link href={`/editVideo?id=${video._id}`}>
              {video.title || "Untitled Video"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import MediaControlCard from "../components/MediaControlCard";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export default function UserDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch("/api/getAllRecordings");
      const data = await response.json();
      setVideos(data);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom align="center">
          Your Video Dashboard
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {videos.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" align="center" color="textSecondary">
                  No videos available. Start creating some!
                </Typography>
              </Grid>
            ) : (
              videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video._id}>
                  <MediaControlCard
                    title={video.title || "LEARN HTML"}
                    author={video.author || "Mann"}
                    image={video.thumbnail || "/html.jpg"}
                    videoId={video._id}
                  />
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

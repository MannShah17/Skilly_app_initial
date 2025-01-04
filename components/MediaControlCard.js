import * as React from "react";
import { useRouter } from "next/router";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function MediaControlCard({ title, author, image, videoId }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/editVideo?id=${videoId}`);
  };

  return (
    <Card sx={{ display: "flex", cursor: "pointer" }} onClick={handleCardClick}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {author}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={image}
        alt="Video thumbnail"
      />
    </Card>
  );
}

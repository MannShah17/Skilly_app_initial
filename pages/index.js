import Head from "next/head";
import { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  TextareaAutosize,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import Cursor from "../components/cursor/Cursor";
import RecorderFooter from "../components/recorderFooter/RecorderFooter";
import useRecorder from "../lib/hooks/useRecorder";
import usePlayer from "../lib/hooks/usePlayer";

const CodeEditor = styled(TextareaAutosize)(({ theme }) => ({
  width: "100%",
  height: "100%",
  padding: "16px",
  fontSize: "16px",
  fontFamily: "'Courier New', Courier, monospace",
  border: "none",
  outline: "none",
  resize: "none",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const OutputFrame = styled("iframe")({
  width: "100%",
  height: "100%",
  border: "none",
});

export default function Home() {
  const {
    recordings,
    recorderElementRef,
    isRecording,
    isPlayerVisible,
    onRecordingStop,
    onRecordingStart,
    recordedTime,
    recorderEndTime,
    recorderStartTime,
    recordedAudio,
  } = useRecorder();

  const { isPlaying, setIsPlaying, cursorRef, progress } = usePlayer(
    recordings,
    recorderStartTime,
    recorderEndTime,
    recordedAudio
  );

  const [htmlContent, setHtmlContent] = useState("");
  const [suggestion, setSuggestion] = useState(
    "Write your HTML code to get AI suggestions."
  );

  const handleInputChange = async (event) => {
    const code = event.target.value;
    setHtmlContent(code);
    // Simulating AI suggestions
    setSuggestion(
      "Consider using semantic HTML tags for better accessibility."
    );
  };

  const handleRecordingStop = async (event) => {
    await onRecordingStop(event);
    const response = await fetch("/api/uploadRecording", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recordings,
        htmlContent,
        recordedTime,
        recorderStartTime,
        recorderEndTime,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <Head>
        <title>Skilly Code Editor</title>
        <meta
          name="description"
          content="Interactive coding with AI suggestions"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Cursor cursorRef={cursorRef} />
      <RecorderFooter
        isRecording={isRecording}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isPlayerVisible={isPlayerVisible}
        onStart={onRecordingStart}
        onStop={handleRecordingStop}
        recordedTime={recordedTime}
        progress={progress}
      />
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container sx={{ height: "100%" }}>
          {/* Left Panel - Code Editor */}
          <Grid item xs={6} sx={{ borderRight: "1px solid #ccc" }}>
            <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Code Editor
              </Typography>
              <CodeEditor
                placeholder="Write your HTML code here..."
                onChange={handleInputChange}
                value={htmlContent}
              />
            </Paper>
          </Grid>

          {/* Right Panel - Output and AI Suggestions */}
          <Grid item xs={6}>
            <Grid container sx={{ height: "100%" }}>
              {/* Top Right - Output */}
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  borderBottom: "1px solid #ccc",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    overflow: "hidden",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Live Output
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <OutputFrame srcDoc={htmlContent} title="Output" />
                  </Box>
                </Paper>
              </Grid>

              {/* Bottom Right - AI Suggestions */}
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    AI Suggestions
                  </Typography>
                  <Card sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="body1">{suggestion}</Typography>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

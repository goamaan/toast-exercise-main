import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Snackbar from "@mui/material/Snackbar"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { onMessage } from "./service/mockServer"
import { SnackbarContent } from "@mui/material"
import { ThumbUp } from "@mui/icons-material"

export default function Content() {
  const [isToastOpen, setIsToastOpen] = React.useState(false)
  const [formSubmission, setFormSubmission] = React.useState({})

  const handleSubmission = (submission) => {
    if (submission?.id) {
      setFormSubmission(submission)
      setIsToastOpen(true)
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setIsToastOpen(false)
  }

  const handleLike = () => {}

  // register the callback handler
  onMessage(handleSubmission)

  const action = (
    <Box>
      <IconButton
        size="small"
        color="inherit"
        aria-label="like"
        onClick={handleLike}
      >
        <ThumbUp fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )

  const toastMessageContent = formSubmission.id ? (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography sx={{ fontWeight: "bold" }}>
        {formSubmission.data.firstName} {formSubmission.data.lastName}
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>
        {formSubmission.data.email}
      </Typography>
    </Box>
  ) : (
    <></>
  )

  return (
    <Box sx={{ marginTop: 3 }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={isToastOpen}
        onClose={handleClose}
      >
        <SnackbarContent message={toastMessageContent} action={action} />
      </Snackbar>
      <Typography variant="h4">Liked Form Submissions</Typography>

      <Typography variant="body1" sx={{ fontStyle: "italic", marginTop: 1 }}>
        TODO: List of liked submissions here (delete this line)
      </Typography>
    </Box>
  )
}

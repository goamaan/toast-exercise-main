import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Snackbar from "@mui/material/Snackbar"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import {
  fetchLikedFormSubmissions,
  onMessage,
  saveLikedFormSubmission,
} from "./service/mockServer"
import { CircularProgress, SnackbarContent } from "@mui/material"
import { ThumbUp } from "@mui/icons-material"
import { SubmissionTable } from "./components/SubmissionTable"

export default function Content() {
  const [isToastOpen, setIsToastOpen] = React.useState(false)

  const [isFetchingLikedSubmissions, setIsFetchingLikedSubmissions] =
    React.useState(false)
  const [likedSubmissions, setLikedSubmissions] = React.useState([])
  const [fetchError, setFetchError] = React.useState(null)

  const [isLikeLoading, setIsLikeLoading] = React.useState(false)
  const [likeError, setLikeError] = React.useState(null)

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

    setFormSubmission({})
    setIsToastOpen(false)
  }

  const handleLike = async () => {
    setIsLikeLoading(true)
    try {
      await saveLikedFormSubmission(formSubmission)
      setIsLikeLoading(false)
      setIsToastOpen(false)
      setFormSubmission({})

      // refetch liked submissions
      await fetchLikedSubmissions()
    } catch (e) {
      console.error(e)
      setLikeError(e)
      setFormSubmission({})
      setIsLikeLoading(false)
    }
  }

  const fetchLikedSubmissions = async () => {
    setIsFetchingLikedSubmissions(true)
    try {
      const res = await fetchLikedFormSubmissions()
      setLikedSubmissions(res.formSubmissions)
      setIsFetchingLikedSubmissions(false)
    } catch (e) {
      console.error(e)
      setFetchError(e)
      setIsFetchingLikedSubmissions(false)
    }
  }

  // fetch liked submissions on mount
  React.useEffect(() => {
    fetchLikedSubmissions()
  }, [])

  // register the callback handler
  onMessage(handleSubmission)

  const action = likeError ? (
    <Box>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  ) : (
    <Box>
      {isLikeLoading ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton
          size="small"
          color="inherit"
          aria-label="like"
          onClick={handleLike}
        >
          <ThumbUp fontSize="small" />
        </IconButton>
      )}

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
  ) : likeError ? (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography sx={{ fontStyle: "italic" }}>{likeError.message}</Typography>
    </Box>
  ) : (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography sx={{ fontStyle: "italic" }}>No form submission</Typography>
    </Box>
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
        {fetchError?.message && fetchError.message}
        {!fetchError &&
          likedSubmissions.length === 0 &&
          !isFetchingLikedSubmissions && (
            <Typography sx={{ fontStyle: "italic" }}>
              No liked submissions
            </Typography>
          )}
      </Typography>
      <SubmissionTable
        isFetchingLikedSubmissions={isFetchingLikedSubmissions}
        likedSubmissions={likedSubmissions}
      />
    </Box>
  )
}

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
import { Alert, Button, CircularProgress, SnackbarContent } from "@mui/material"
import { ThumbUp } from "@mui/icons-material"
import { SubmissionTable } from "./components/SubmissionTable"
import { errorMessage } from "./utils"

export default function Content() {
  const [toastState, setToastState] = React.useState({
    isOpen: false,
    formSubmission: {},
  })

  const [fetchState, setFetchState] = React.useState({
    isFetching: false,
    likedSubmissions: [],
    error: null,
  })

  const [likeState, setLikeState] = React.useState({
    isLoading: false,
    error: null,
  })

  const handleSubmission = (submission) => {
    if (submission?.id) {
      setToastState({
        isOpen: true,
        formSubmission: submission,
      })
    }
  }

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setToastState((prevState) => ({
      ...prevState,
      isOpen: false,
      formSubmission: {},
    }))
    setLikeState((prevState) => ({ ...prevState, error: null }))
  }

  const handleLike = async () => {
    setLikeState((prevState) => ({ ...prevState, isLoading: true }))
    try {
      await saveLikedFormSubmission(toastState.formSubmission)
      setLikeState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: null,
      }))
      setToastState((prevState) => ({
        ...prevState,
        isOpen: false,
        formSubmission: {},
      }))

      // refetch liked submissions
      await fetchLikedSubmissions()
    } catch (e) {
      console.error(e)
      setLikeState({ isLoading: false, error: e })
    }
  }

  const fetchLikedSubmissions = async () => {
    setFetchState((prevState) => ({ ...prevState, isFetching: true }))
    try {
      const res = await fetchLikedFormSubmissions()
      setFetchState({
        isFetching: false,
        likedSubmissions: res.formSubmissions,
        error: null,
      })
    } catch (e) {
      console.error(e)
      setFetchState((prevState) => ({
        ...prevState,
        isFetching: false,
        error: e,
      }))
    }
  }

  // fetch liked submissions on mount
  React.useEffect(() => {
    fetchLikedSubmissions()
  }, [])

  // register the callback handler
  onMessage(handleSubmission)

  // on error likeState, show retry button
  const action = likeState.error ? (
    <Box display={"flex"} gap={1} alignItems={"center"}>
      {likeState.isLoading ? (
        <CircularProgress size={20} />
      ) : (
        <Button
          size="small"
          aria-label="close"
          color="warning"
          onClick={handleLike}
        >
          Retry Like
        </Button>
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
  ) : (
    <Box>
      {likeState.isLoading ? (
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

  // show error message or form submission
  const toastMessageContent = likeState.error ? (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography sx={{ fontStyle: "italic" }}>
        {errorMessage(likeState.error.message)}
      </Typography>
    </Box>
  ) : toastState.formSubmission.id ? (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography sx={{ fontWeight: "bold" }}>
        {toastState.formSubmission.data.firstName}{" "}
        {toastState.formSubmission.data.lastName}
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>
        {toastState.formSubmission.data.email}
      </Typography>
    </Box>
  ) : (
    <></>
  )

  return (
    <Box
      sx={{ marginY: 3 }}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={toastState.isOpen}
        onClose={handleClose}
      >
        <SnackbarContent message={toastMessageContent} action={action} />
      </Snackbar>
      <Typography variant="h4">Liked Form Submissions</Typography>
      {fetchState.error && (
        <Alert severity="error">{errorMessage(fetchState.error.message)}</Alert>
      )}
      {/* Retry button */}
      {fetchState.error && !fetchState.isFetching && (
        <Button
          variant="contained"
          onClick={fetchLikedSubmissions}
          sx={{ marginTop: 1 }}
        >
          Retry
        </Button>
      )}
      <SubmissionTable
        isFetchingLikedSubmissions={fetchState.isFetching}
        likedSubmissions={fetchState.likedSubmissions}
      />
    </Box>
  )
}

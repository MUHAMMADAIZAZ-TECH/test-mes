import { useState } from "react";

function useSnackbar() {
    const [snackbar, setSnackbar] = useState({ type: "success", text: "", open: false });

    const handleSnackbarOpen = (type = "success", text) => {
        setSnackbar({ type, text, open: true });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ type: "", text: "", open: false });
    };
    return {
        snackbar,
        handleSnackbarOpen,
        handleSnackbarClose,
    };
}
export default useSnackbar;
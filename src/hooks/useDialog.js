import { useState } from "react";

const useDialog = () => {
  const [dialog, setDialog] = useState({
    open: false,
    message: "",
    actionCallback: null,
  });

  const handleAction = (message, callback) => {
    setDialog({ open: true, message: message, actionCallback: callback });
  };

  const handleConfirm = () => {
    if (dialog.actionCallback) {
      dialog.actionCallback();
    }
    setDialog((prev) => ({ ...prev, open: false, actionCallback: null }));
  };

  const handleCloseDialog = () => {
    setDialog((prev) => ({ ...prev, open: false, actionCallback: null }));
  };

  return { dialog, handleAction, handleConfirm, handleCloseDialog };
};

export default useDialog;

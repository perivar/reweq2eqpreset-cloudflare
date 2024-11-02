import React, { createContext, useCallback, useContext, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

// Type definition for dialog options
interface DialogOptions {
  title: string;
  description: string;
  alert?: boolean; // if alert is true, this is a simple alert dialog
  cancelLabel?: string; // Label for the cancel button
  confirmLabel?: string; // Label for the confirm button
  closeLabel?: string; // Label for the close button
}

// Default options for the dialog
const DEFAULT_OPTIONS: DialogOptions = {
  title: "",
  description: "",
  alert: false,
  cancelLabel: "Cancel", // Default cancel button label
  confirmLabel: "Continue", // Default confirm button label
  closeLabel: "Close", // Default close button label
};

// Type definition for Confirm context
interface ConfirmContextProps {
  confirm: (options: DialogOptions) => Promise<void>;
}

// Create Confirm context
const ConfirmContext = createContext<ConfirmContextProps | undefined>(
  undefined
);

export const ConfirmProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  // State to manage dialog options
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({
    ...DEFAULT_OPTIONS,
  });

  // State to manage resolve and reject for dialog
  const [resolveReject, setResolveReject] = useState<
    [() => void, (reason?: unknown) => void] | []
  >([]);

  const [resolveFn, rejectFn] = resolveReject;

  // Confirm function: Shows the dialog and returns a Promise
  const confirm = useCallback((newOptions: DialogOptions): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      setDialogOptions({ ...DEFAULT_OPTIONS, ...newOptions });
      setResolveReject([resolve, reject]);
    });
  }, []);

  // Handler to close the dialog
  const handleClose = useCallback(() => {
    setResolveReject([]); // Clear resolve/reject functions when dialog is closed
  }, []);

  // Handler for the cancel button
  const handleCancel = useCallback(() => {
    if (rejectFn) {
      rejectFn(new Error("User canceled the dialog"));
    }
    handleClose();
  }, [rejectFn, handleClose]);

  // Handler for the confirm button
  const handleConfirm = useCallback(() => {
    if (resolveFn) resolveFn();
    handleClose();
  }, [resolveFn, handleClose]);

  return (
    <>
      {/* Render the dialog */}
      <AlertDialog open={resolveReject.length === 2}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogOptions.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogOptions.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {dialogOptions.alert
                ? dialogOptions.closeLabel
                : dialogOptions.cancelLabel}
            </AlertDialogCancel>
            {!dialogOptions.alert && (
              <AlertDialogAction onClick={handleConfirm}>
                {dialogOptions.confirmLabel}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Provide the Confirm context */}
      <ConfirmContext.Provider value={{ confirm }}>
        {children}
      </ConfirmContext.Provider>
    </>
  );
};

// useConfirm hook: A hook to use Confirm context
export const useConfirm = (): ((options: DialogOptions) => Promise<void>) => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }

  return context.confirm;
};

export default ConfirmProvider;

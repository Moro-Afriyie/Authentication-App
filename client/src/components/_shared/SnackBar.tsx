import * as React from "react";
import "./Snackbar.scss";
import { ICONS } from "../../utils/config";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISnackBarProps {
  message: string;
  success: boolean;
  show: boolean;
  handleClose: () => void;
}

const SnackBar: React.FunctionComponent<ISnackBarProps> = ({
  message,
  success,
  show,
  handleClose,
}) => {
  return (
    <div
      id="snackbar"
      style={{ backgroundColor: success ? "#6ab04c" : "#eb4d4b" }}
      className={show ? "show" : ""}
    >
      <div className="left">
        <span className="material-symbols-outlined">
          {success ? ICONS.SUCCESS : ICONS.INFO}
        </span>
        <span>{message}</span>
      </div>
      <span
        className="material-symbols-outlined close-btn"
        onClick={handleClose}
      >
        {ICONS.CLOSE}
      </span>
    </div>
  );
};

export default SnackBar;

import * as React from "react";
import { ICONS } from "../../utils/config";
import "./ErrorMessage.scss";

interface IErrorMessageProps {
  message: string;
  handleClose: () => void;
}

const ErrorMessage: React.FunctionComponent<IErrorMessageProps> = ({
  message,
  handleClose,
}) => {
  return (
    <div className="error-message">
      <span>{message}</span>
      <span
        className="material-symbols-outlined close-btn"
        onClick={handleClose}
      >
        {ICONS.CLOSE}
      </span>
    </div>
  );
};

export default ErrorMessage;

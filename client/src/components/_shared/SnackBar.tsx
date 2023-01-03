import * as React from "react";
import "./Snackbar.scss";
import { ICONS } from "../../utils/config";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISnackBarProps {}

const SnackBar: React.FunctionComponent<ISnackBarProps> = (props) => {
  const handleClose = () => {
    console.log("close snackbar clicked.....");
  };

  return (
    <div id="snackbar" className="show">
      <div className="left">
        <span className="material-symbols-outlined">check_circle</span>
        <span>Some text some message..</span>
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

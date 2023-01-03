import * as React from "react";
import "./Snackbar.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISnackBarProps {}

const SnackBar: React.FunctionComponent<ISnackBarProps> = (props) => {
  return (
    <div id="snackbar" className="show">
      Some text some message..
    </div>
  );
};

export default SnackBar;

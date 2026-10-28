import React from "react";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
function ErrorBanner({ message, type, setClose }) {
  return (
    <>
      {type == "error" ? (
        <div
          className="error-banner-common-style"
          style={{
            border: "2px solid #BC9699",
            backgroundColor: "#ECC8C5",
          }}
        >
          <div style={{display: "flex"}}>
            <NotInterestedIcon
              style={{ color: "#B04347", marginRight: "10px", marginTop: "4px" }}
            />
            <p style={{ color: "#B04347", fontSize: "18px" }}>{message}</p>
          </div>

          <CloseIcon
            style={{ color: "#B04347", marginTop: "4px", cursor: "pointer" }}
            onClick={() => setClose(false)}
          />
        </div>
      ) : (
        <div
          className="error-banner-common-style"
          style={{
            border: "2px solid #D2E8CC",
            backgroundColor: "#DEF2D5",
          }}
        >
          <div>
            <CheckIcon style={{ color: "#708769", marginRight: "10px" }} />
            <p style={{ color: "#708769", fontSize: "18px" }}>{message}</p>
          </div>

          <CloseIcon
            style={{ color: "#708769", marginRight: "10px", cursor: "pointer" }}
            onClick={() => setClose(false)}
          />
        </div>
      )}
    </>
  );
}

export default ErrorBanner;

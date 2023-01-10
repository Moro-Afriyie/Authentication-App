import React from "react";
import { Navigate } from "react-router";
import Cookies from "js-cookie";

export type ProtectedRouteProps = {
  authenticationPath: string;
  outlet: JSX.Element;
};

export default function ProtectedRoute({
  authenticationPath,

  outlet,
}: ProtectedRouteProps) {
  if (Cookies.get("token")) {
    return outlet;
  } else {
    return <Navigate to={authenticationPath} />;
  }
}

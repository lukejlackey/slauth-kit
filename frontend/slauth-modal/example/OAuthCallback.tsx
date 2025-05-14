import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("slauth_token", token);
    }
    // Redirect to the main page
    navigate("/", { replace: true });
  }, [navigate]);

  return <div className="text-center p-4">Signing you in…</div>;
}
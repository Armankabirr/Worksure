import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthRedirectHandler() {
  const { openLogin, openRegister } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { openLogin?: boolean; openRegister?: boolean } | null;
    if (!state?.openLogin && !state?.openRegister) return;
    if (state.openLogin) openLogin();
    if (state.openRegister) openRegister();
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate, openLogin, openRegister]);

  return null;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true, state: { openRegister: true } });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Redirecting to sign up…</p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de login
    login({ id: "1", name: "Admin", role: "ADMIN_GLOBAL" });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

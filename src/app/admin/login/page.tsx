"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";

interface LoginResponse {
  message?: string;
  success?: boolean;
}

interface FormData {
  username: string;
  password: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: ""
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError("");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data: LoginResponse = await res.json();

      if (res.ok) {
        setError("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Lỗi hệ thống, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin</h1>
            <p className="text-gray-300">Đăng nhập để truy cập hệ thống</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label htmlFor="username" className="sr-only">
                Tên đăng nhập
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleInputChange('username')}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                required
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange('password')}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors disabled:cursor-not-allowed"
                disabled={isLoading}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Bảo mật và an toàn cho hệ thống của bạn
            </p>
          </div>
        </div>

        <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
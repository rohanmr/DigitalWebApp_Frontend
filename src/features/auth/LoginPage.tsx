import { LoginForm } from "@/features/auth/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-svh w-full bg-[#fdf8f3] flex flex-col lg:flex-row">
      {/* Branding panel */}
      <div className="lg:w-1/2 bg-[#7a1f2b] text-white flex flex-col items-center justify-center px-6 py-10 lg:py-0">
        <div className="text-center space-y-2 max-w-sm">
          <p className="text-sm tracking-wide text-orange-200">
            श्री पवनारा गणपती गणेश मंडळ
          </p>
          <h1 className="text-2xl lg:text-3xl font-bold">धाराशिव</h1>
          <p className="text-xs text-orange-200">स्थापना - १९९५</p>
          <p className="pt-4 text-lg">गणपती बाप्पा मोरया 🙏</p>
        </div>
      </div>

      {/* Login form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border p-6 lg:p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-semibold text-[#7a1f2b]">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground">
              Login to manage donations
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

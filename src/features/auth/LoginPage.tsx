import { LoginForm } from "@/features/auth/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-svh w-full bg-[#fdf8f3]">
      {/* ================= DESKTOP (3-column) ================= */}
      <div className="hidden lg:flex min-h-svh">
        {/* Left — branding panel */}
        <div className="temple-pattern flex w-[26%] flex-col items-center justify-center gap-4 bg-[#7a1f2b] px-6 text-center text-white">
          <img
            src="/images/logo-image.png"
            alt="श्री पावणारा गणपती"
            className="h-56 w-56 rounded-full border-4 border-[#f6c453] object-cover shadow-lg"
          />
          <div>
            <p className="text-sm text-orange-100">गणेश मंडळ, धाराशिव</p>
            <p className="text-xs text-orange-200">स्थापना - १९६५</p>
          </div>
          {/* <div className="text-2xl">🪔</div> */}
        </div>

        {/* Middle — login form */}
        <div className="flex flex-1 items-center justify-center px-10">
          <div className="w-full max-w-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#7a1f2b]">Login</h2>
              <p className="text-sm text-muted-foreground">
                Welcome back! Please login to your account
              </p>
            </div>
            <LoginForm />
            <p className="text-center text-sm text-[#7a1f2b]">
              || गणपती बाप्पा मोरया ||
            </p>
          </div>
        </div>

        {/* Right — idol photo panel */}
        <div className="relative w-[32%] overflow-hidden">
          <img
            src="/images/ganpati-logo.jpeg"
            alt="Shree Ganpati"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-4 " />
        </div>
      </div>

      {/* ================= MOBILE (stacked) ================= */}
      <div className="flex min-h-svh flex-col lg:hidden">
        <div className="relative">
          <div className="temple-pattern relative h-52 w-full overflow-hidden bg-[#7a1f2b]">
            {/* <img
              src="/images/ganpati-logo.jpeg"
              alt="Shree Ganpati"
              className="h-full w-full object-cover opacity-90"
            /> */}
          </div>

          {/* Overlapping logo badge */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <img
              src="/images/logo-image.png"
              alt="श्री पावणारा गणपती"
              className="h-48 w-48 rounded-full border-4 border-white object-cover shadow-lg"
            />
          </div>
        </div>

        <div className="mt-14 space-y-1 px-6 text-center">
          <h1 className="text-lg font-bold text-[#7a1f2b]">
            श्री पावणारा गणपती
          </h1>
          <p className="text-sm text-muted-foreground">गणेश मंडळ, धाराशिव</p>
          <p className="text-xs text-muted-foreground">स्थापना - १९६५</p>
        </div>

        <div className="flex-1 px-6 py-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#7a1f2b]">
              Login
            </h2>
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-sm font-medium text-[#7a1f2b]">
            गणपती बाप्पा मोरया 🙏
          </p>
        </div>
      </div>
    </div>
  );
}

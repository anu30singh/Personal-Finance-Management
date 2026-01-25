import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-200 text-zinc-900">
      
     
      <nav className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Flexiwallet</h1>
        <Link
          to="/login"
          className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
        >
          Login
        </Link>
      </nav>

     {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-20 md:pt-16 pb-12 ">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          
          {/* Text */}
          <div className="text-center md:text-left space-y-6 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight max-w-xl">
              Take control of your
              <span className="block bg-gradient-to-r from-zinc-700 to-zinc-500 bg-clip-text text-transparent mt-2">
                personal finances
              </span>
            </h2>

            <p className="text-lg md:text-xl text-zinc-600 max-w-lg leading-relaxed">
              Flexiwallet helps you track spending, manage savings,
              and understand your money — all in one calm, secure place
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/signup"
                className="group relative bg-zinc-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform text-center"
              >
                Create free account
                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </a>
              <a
                href="/login"
                className="px-8 py-4 rounded-xl border-2 border-zinc-300 text-zinc-700 font-semibold hover:border-zinc-900 hover:bg-white/50 transition-all text-center"
              >
                Sign in
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-8 text-sm text-zinc-600 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Secure & private</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/10 to-zinc-600/10 blur-3xl rounded-full"></div>
            <img
              src="/src/assets/landing.png"
              alt="Personal finance wallet illustration"
              className="relative max-w-sm w-full opacity-90 hover:opacity-100 transition-opacity duration-500 drop-shadow-2xl"
            />
          </div>
        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Tracking",
              desc: "Log your income and expenses with clarity, not clutter.",
            },
            {
              title: "Goal-based Savings",
              desc: "Create savings goals and track progress visually.",
            },
            {
              title: "Meaningful Insights",
              desc: "Understand your money without overwhelming charts.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="text-sm text-zinc-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mt-24 text-center">
        <h3 className="text-3xl font-semibold">
          Finance should feel calm
        </h3>
        <p className="mt-4 text-zinc-600 text-lg max-w-2xl mx-auto">
          Managing money shouldn’t be stressful. Flexiwallet is designed to be
          simple, secure, and intentional — so you stay in control.
        </p>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-zinc-300/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold">Flexiwallet</h4>
            <p className="text-sm text-zinc-500 mt-1">
              A calm way to manage your money.
            </p>
          </div>

          <div className="flex gap-6 text-sm text-zinc-600">
            <Link to="/login" className="hover:text-zinc-900">
              Login
            </Link>
            <Link to="/signup" className="hover:text-zinc-900">
              Sign up
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-500 pb-6">
          © {new Date().getFullYear()} Flexiwallet. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Landing;

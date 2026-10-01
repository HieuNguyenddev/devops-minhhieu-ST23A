export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Minh Hieu Portfolio
          </span>
          <nav className="flex space-x-6 text-sm text-slate-400 font-medium">
            <a href="#about" className="hover:text-blue-400 transition">Giới Thiệu</a>
            <a href="#skills" className="hover:text-blue-400 transition">Kỹ Năng</a>
            <a href="#projects" className="hover:text-blue-400 transition">Dự Án</a>
            <a href="#contact" className="hover:text-blue-400 transition">Liên Hệ</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16">
        <section className="flex flex-col md:flex-row items-center justify-between gap-10 py-10">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Sinh Viên Đại Học Đông Á - K23
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Xin chào, tôi là <br />
              <p>Tôi là sinh viên năm 2 </p>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Nguyễn Minh Hiếu
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl">
              Đam mê lập trình Web & DevOps. Chuyên môn xây dựng ứng dụng Next.js hiện đại, cấu hình quy trình CI/CD tự động hóa trên Jenkins, GitHub Actions và Vercel.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#projects"
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition shadow-lg shadow-blue-500/25"
              >
                Xem Dự Án
              </a>
              <a
                href="https://github.com/HieuNguyenddev/devops-minhhieu-ST23A"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition"
              >
                GitHub Repository
              </a>
            </div>
          </div>

          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl flex-shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
              <span className="text-6xl font-black text-slate-300">MH</span>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-12 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6">🛠️ Kỹ Năng & Công Nghệ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Next.js / React", desc: "Frontend Framework" },
              { name: "DevOps CI/CD", desc: "Jenkins & GitHub Actions" },
              { name: "Vercel Cloud", desc: "Automated Deployment" },
              { name: "Docker & Git", desc: "Container & SCM" },
              { name: "Tailwind CSS", desc: "UI & Responsive" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "Node.js", desc: "Backend Development" },
              { name: "Chatbot API", desc: "Telegram & Webhooks" },
            ].map((skill, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="font-semibold text-white">{skill.name}</div>
                <div className="text-xs text-slate-400 mt-1">{skill.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6">🚀 Dự Án Nổi Bật</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-blue-500/50 transition">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">DevOps Project</span>
              <h3 className="text-xl font-bold text-white">Next.js CI/CD Pipeline với Vercel & Jenkins</h3>
              <p className="text-slate-400 text-sm">
                Xây dựng quy trình tự động hóa thử nghiệm, đóng gói và triển khai ứng dụng web lên hạ tầng Vercel Cloud kết hợp Chatbot báo cáo kết quả.
              </p>
              <div className="flex gap-2 flex-wrap text-xs font-mono text-slate-300">
                <span className="px-2.5 py-1 bg-slate-800 rounded">Next.js 16</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded">Jenkins</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded">GitHub Actions</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded">Vercel</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-purple-500/50 transition">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Web Application</span>
              <h3 className="text-xl font-bold text-white">Trang Tin Tức & Tuyển Sinh Đại Học Đông Á</h3>
              <p className="text-slate-400 text-sm">
                Giao diện giới thiệu trường đại học Đông Á tối ưu SEO, chuẩn responsive trên di động và tích hợp hiệu ứng UI hiện đại.
              </p>
              <div className="flex gap-2 flex-wrap text-xs font-mono text-slate-300">
                <span className="px-2.5 py-1 bg-slate-800 rounded">React 19</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded">Tailwind CSS</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded">TypeScript</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 border-t border-slate-800">
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Liên Hệ & Kết Nối</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Bạn có dự án cần hợp tác hoặc câu hỏi về quy trình DevOps? Hãy kết nối với tôi qua GitHub hoặc Email bên dưới.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <a
                href="https://github.com/HieuNguyenddev"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
              >
                GitHub Profile
              </a>
              <a
                href="mailto:minhhieu@donga.edu.vn"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition"
              >
                Gửi Email
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 bg-slate-950 text-center text-slate-500 text-xs">
        © 2026 Nguyễn Minh Hiếu - Trường Đại Học Đông Á. Powered by Next.js & Vercel.
      </footer>
    </div>
  );
}
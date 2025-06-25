import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  // Dummy data for statistics; replace with real logic
  const totalVisits = 124;
  const monthlyVisits = 678;
  const onlineUsers = 12;

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Cột 1: Logo + giới thiệu */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo HCMUTE"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Trường Đại Học Sư Phạm Kỹ Thuật TP. HCM
                </h3>
                <p className="text-gray-300">Phòng Thanh Tra - Pháp Chế</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Phòng Thanh Tra - Pháp Chế thực hiện chức năng thanh tra, kiểm
              tra việc thực hiện các quy định pháp luật, quy chế, quy định của
              Nhà nước và của Trường trong các hoạt động giáo dục, đào tạo,
              nghiên cứu khoa học.
            </p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Cột 2: Liên hệ */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Thông tin liên hệ</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-blue-400" />
                <p>
                  1 Võ Văn Ngân, Phường Linh Chiểu <br />
                  Thành Phố Hồ Chí Minh
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-0.5 text-blue-400" />
                <p>(08) 37221223 (nhánh 48180)</p>
              </div>
            </div>
          </div>

          {/* Cột 3: Thống kê & liên kết */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Thống kê & Liên kết</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="space-y-1 mb-4">
                <p>
                  👁️ Truy cập trong ngày:{" "}
                  <span className="text-white font-semibold">{totalVisits}</span>
                </p>
                <p>
                  📅 Tổng số lượt truy cập trong tháng:{" "}
                  <span className="text-white font-semibold">
                    {monthlyVisits}
                  </span>
                </p>
                <p>
                  🟢 Đang online:{" "}
                  <span className="text-white font-semibold">
                    {onlineUsers}
                  </span>
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 mt-0.5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Website Phòng TT-PC:</p>
                  <a
                    href="https://aio.hcmute.edu.vn"
                    className="text-blue-400 hover:text-blue-300 transition text-sm"
                  >
                    aio.hcmute.edu.vn
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-0.5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Email Phòng TT-PC:</p>
                  <a
                    href="mailto:pttpc@hcmute.edu.vn"
                    className="text-blue-400 hover:text-blue-300 transition text-sm"
                  >
                    pttpc@hcmute.edu.vn
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 mt-0.5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Tra cứu văn bản:</p>
                  <a
                    href="https://vanban.hcmute.edu.vn"
                    className="text-blue-400 hover:text-blue-300 transition text-sm"
                  >
                    vanban.hcmute.edu.vn
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-0.5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Email tra cứu:</p>
                  <a
                    href="mailto:vanban@hcmute.edu.vn"
                    className="text-blue-400 hover:text-blue-300 transition text-sm"
                  >
                    vanban@hcmute.edu.vn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p>
              © 2025, Phòng Thanh Tra - Pháp Chế, Trường Đại Học Sư Phạm Kỹ
              Thuật TP. HCM
            </p>
            <p className="text-xs mt-1">Tất cả quyền được bảo lưu</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-white transition">
              Điều khoản sử dụng
            </a>
            <a href="#" className="hover:text-white transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

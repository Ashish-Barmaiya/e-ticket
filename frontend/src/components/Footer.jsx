import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 bg-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-teal-400">Ticketo</h2>
          <p className="mt-2 text-gray-400">
            Secure, seamless, and smart ticketing for everyone.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-teal-400">Quick Links</h3>
          <Link
            href="/"
            className="text-gray-400 hover:text-teal-300 transition"
          >
            Home
          </Link>
          <Link
            href="/events"
            className="text-gray-400 hover:text-teal-300 transition"
          >
            Events
          </Link>
          <Link
            href="/resale"
            className="text-gray-400 hover:text-teal-300 transition"
          >
            Resale
          </Link>
          <Link
            href="/contact"
            className="text-gray-400 hover:text-teal-300 transition"
          >
            Contact
          </Link>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-teal-400">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a
              href="#"
              className="text-gray-400 hover:text-teal-300 transition"
            >
              <i className="fab fa-facebook text-xl">facebook</i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-teal-300 transition"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-teal-300 transition"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-teal-300 transition"
            >
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Ticketo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

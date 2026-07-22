import Link from "next/link";
import { MapPin, Mail, Phone, Instagram, Globe, ArrowUpRight } from "lucide-react";

const footerLinks = {
  company: [
    { href: "/", label: "Home" },
    { href: "/tentang-kami", label: "Tentang Kami" },
    { href: "/layanan", label: "Layanan" },
    { href: "/kontak", label: "Hubungi Kami" },
  ],
  business: [
    { href: "/katalog", label: "Katalog Produk" },
    { href: "/kelas-quantum", label: "Kelas Instapro" },
    { href: "/berita", label: "Berita & Artikel" },
    { href: "/analytics", label: "Analytics" },
  ],
  legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Refund Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-navy-500 border-t border-navy-600 z-10">
      {/* Subtle top divider line in Crimson */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-500" />

      <div className="section-container py-16 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center group mb-4">
              <img
                src="/logo-landscape.png"
                alt="InstaPro Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Mitra transformasi digital untuk organisasi dan bisnis. Membangun sistem digital & meningkatkan kapasitas SDM.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/instapro.co.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-brand-500 hover:bg-white transition-all"
              >
                <Instagram size={18} />
              </a>

            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-brand-500 text-sm transition-colors flex items-center gap-1 group font-medium"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Business
            </h4>
            <ul className="space-y-3">
              {footerLinks.business.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-brand-500 text-sm transition-colors flex items-center gap-1 group font-medium"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Kantor Pusat
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm leading-relaxed">
                  Jalan Duyung No. 100 D, Pekanbaru, Riau 28282, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-500 flex-shrink-0" />
                <a href="mailto:info@instapro.co.id" className="text-white/70 hover:text-brand-500 text-sm transition-colors font-medium">
                  info@instapro.co.id
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-500 flex-shrink-0" />
                <a href="tel:+628217710106" className="text-white/70 hover:text-brand-500 text-sm transition-colors font-medium">
                  +62 821-7710-106
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/50 text-xs text-center md:text-left">
              <p className="font-semibold text-white/70">PT. Insta Pro Solution</p>
              <p className="mt-1">NIB: 1601260059674 | SK MENKUMHAM: AHU-0101529.AH.01.01.TAHUN 2025</p>
            </div>
            <p className="text-white/50 text-xs text-center md:text-right">
              © {new Date().getFullYear()} InstaPro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

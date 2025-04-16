'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from '@phosphor-icons/react/dist/ssr';

const Footer = () => {
  return (
    <div id="footer" className="footer mt-10 bg-gray-900 text-white">
      <div className="footer-main py-10">
        <div className="container mx-auto px-4">
          <div className="content-footer flex flex-wrap justify-between gap-8">
            <div className="company-infor w-full lg:w-1/4 pr-5">
              <Link href="/" className="logo">
                <h2 className="text-2xl font-bold">ImagingGifts</h2>
              </Link>
              <div className="flex gap-4 mt-4">
                <div className="flex flex-col text-sm">
                  <span className="font-bold">Mail:</span>
                  <span className="mt-2 font-bold">Phone:</span>
                  <span className="mt-2 font-bold">Address:</span>
                </div>
                <div className="flex flex-col text-sm">
                  <span>support@imaginggifts.com</span>
                  <span className="mt-2">1-800-555-1234</span>
                  <span className="mt-2">123 Photo Lane, Lens City, CA 90210</span>
                </div>
              </div>
            </div>
            <div className="right-content flex flex-wrap gap-8 w-full lg:w-3/4">
              <div className="list-nav flex flex-wrap w-full gap-8">
                <div className="w-1/3">
                  <h3 className="text-lg font-semibold mb-4">Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/pages/contact">Contact us</Link></li>
                    <li><Link href="#">Career</Link></li>
                    <li><Link href="/my-account">My Account</Link></li>
                    <li><Link href="/order-tracking">Order & Returns</Link></li>
                    <li><Link href="/pages/faqs">FAQs</Link></li>
                  </ul>
                </div>
                <div className="w-1/3">
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/shop/cameras">Cameras</Link></li>
                    <li><Link href="/shop/accessories">Accessories</Link></li>
                    <li><Link href="/shop/lenses">Lenses</Link></li>
                    <li><Link href="/shop/tripods">Tripods</Link></li>
                    <li><Link href="/blog">Blog</Link></li>
                  </ul>
                </div>
                <div className="w-1/3">
                  <h3 className="text-lg font-semibold mb-4">Customer Services</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/pages/faqs">Orders FAQs</Link></li>
                    <li><Link href="/pages/shipping">Shipping</Link></li>
                    <li><Link href="/pages/privacy">Privacy Policy</Link></li>
                    <li><Link href="/order-tracking">Return & Refund</Link></li>
                  </ul>
                </div>
              </div>
              <div className="newsletter w-full lg:w-1/3">
                <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                <p className="text-sm mb-4">Sign up for our newsletter and get updates on the latest photography gear and offers!</p>
                <form className="relative">
                  <input
                    type="email"
                    placeholder="Enter your e-mail"
                    className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none"
                  />
                  <button className="absolute top-0 right-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <Icon.ArrowRight size={20} />
                  </button>
                </form>
                <div className="list-social flex gap-4 mt-4">
                  <Link href="https://www.facebook.com/" target="_blank"><Icon.FacebookLogo size={24} /></Link>
                  <Link href="https://www.instagram.com/" target="_blank"><Icon.InstagramLogo size={24} /></Link>
                  <Link href="https://www.twitter.com/" target="_blank"><Icon.TwitterLogo size={24} /></Link>
                  <Link href="https://www.youtube.com/" target="_blank"><Icon.YoutubeLogo size={24} /></Link>
                  <Link href="https://www.pinterest.com/" target="_blank"><Icon.PinterestLogo size={24} /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom py-4 border-t border-gray-700">
          <div className="container mx-auto px-4 flex flex-wrap justify-between gap-4">
            <p className="text-sm">©2025 ImagingGifts. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <select className="bg-transparent text-sm">
                <option value="English">English</option>
                <option value="Espana">Espana</option>
                <option value="France">France</option>
              </select>
              <select className="bg-transparent text-sm">
                <option value="USD">INR</option>
               
              </select>
            </div>
            <div className="flex gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <Image
                  key={index}
                  src={`/images/payment/Frame-${index}.png`}
                  alt="payment"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

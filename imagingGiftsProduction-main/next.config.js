/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com', 'picsum.photos' , 'source.unsplash.com'], // Add all external image domains here
      
      },
}

module.exports = nextConfig

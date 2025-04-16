/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.imaginggifts.com",
  generateRobotsTxt: true, // Generate robots.txt file
  exclude: ["/api/*", "/404"], // Exclude unwanted routes
  sitemapSize: 200, // Number of URLs per sitemap file
  changefreq: "daily", // Change frequency for all URLs
  priority: 0.7, // Default priority for all URLs

  // Generate dynamic product URLs
  async additionalPaths() {
    const fetch = (await import("node-fetch")).default;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=1000`); // Fetch all product URLs
      if (!response.ok) throw new Error("Failed to fetch product data");

      const { data: products } = await response.json();

      if (!products || !Array.isArray(products)) {
        throw new Error("Invalid product data received");
      }

      return products.map((product) => ({
        loc: `/product?id=${product._id}`, // Use query parameter for product URLs
        lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
        changefreq: "daily",
        priority: 0.8, // Higher priority for products
      }));
    } catch (error) {
      console.error("Error generating product sitemap:", error);
      return [];
    }
  },
};

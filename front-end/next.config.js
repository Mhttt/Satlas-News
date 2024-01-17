/** @type {import('next').NextConfig} */
const nextConfigDevelopment = {
  reactStrictMode: true,
  trailingSlash: true,
  async rewrites() { //this is only for easy development, it is not supported in production due to next export
    return [
      {
        source: '/.auth/:slug*/auth0',
        destination: 'http://localhost:4280/.auth/:slug*/auth0',
      },
      {
        source: '/api/:slug*',
        destination: 'http://localhost:4280/api/:slug*',
      },
    ];
  },
};

const nextConfigProduction = {
  ...nextConfigDevelopment,
  images: {
    loader: 'cloudinary',
    domains: ['res.cloudinary.com'],
    path: 'satlas',
  },
};

module.exports =
  process.env.NODE_ENV === 'production'
    ? nextConfigProduction
    : nextConfigDevelopment;

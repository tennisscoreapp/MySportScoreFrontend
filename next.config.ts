import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

// When set (in production), /api/v1/* on this site is proxied to the Go API so
// the session cookie stays first-party. Rewrites are fixed at build time.
const apiProxyTarget = process.env.API_PROXY_TARGET

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	},
	async rewrites() {
		if (!apiProxyTarget) return []
		return [
			{
				source: '/api/v1/:path*',
				destination: `${apiProxyTarget}/api/v1/:path*`,
			},
		]
	},
}

export default withNextIntl(nextConfig)

import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    turbopack: {
        root: path.resolve(__dirname, '.'),
    },
    images: {
        remotePatterns: [
            new URL(
                'https://maeddtczxe8l2lng.public.blob.vercel-storage.com/**'
            ),
        ],
    },
}

export default nextConfig

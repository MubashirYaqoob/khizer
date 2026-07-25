import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://khizarfabricstore.store'
    const now = new Date()

    // Static base routes
    const baseRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/customized`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/shipping-policy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ]

    try {
        // Fetch categories dynamically
        const categories = await prisma.category.findMany({
            select: { slug: true }
        })

        const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
            url: `${baseUrl}/category/${cat.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        }))

        // Fetch active products dynamically
        const products = await prisma.product.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true }
        })

        const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
            url: `${baseUrl}/product/${prod.id}`,
            lastModified: prod.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.64,
        }))

        return [...baseRoutes, ...categoryRoutes, ...productRoutes]
    } catch (error) {
        console.error("Error generating dynamic sitemap:", error)
        return baseRoutes
    }
}
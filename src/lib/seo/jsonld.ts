import type { SalonWithRelations } from '@/lib/types/database';

const BASE_URL = 'https://trimming.michi-biki.jp';

/**
 * Generate JSON-LD structured data for a salon (LocalBusiness + HairSalon schema)
 */
export function generateSalonJsonLd(salon: SalonWithRelations) {
  const reviews = salon.reviews ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HairSalon'],
    name: salon.name,
    description: salon.description ?? undefined,
    url: `${BASE_URL}/salons/${salon.id}`,
    telephone: salon.phone ?? undefined,
  };

  // Image
  if (salon.image_url) {
    jsonLd.image = salon.image_url;
  }

  // Website URL
  if (salon.website_url) {
    jsonLd.sameAs = salon.website_url;
  }

  // Price range (derived from services min/max price)
  const services = salon.services ?? [];
  const prices = services
    .map((s) => s.price)
    .filter((p): p is number => p != null);
  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    jsonLd.priceRange = `¥${minPrice.toLocaleString()}〜¥${maxPrice.toLocaleString()}`;
  }

  // Address (PostalAddress)
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
  };
  if (salon.address) {
    address.streetAddress = salon.address;
  }
  if (salon.cities?.name) {
    address.addressLocality = salon.cities.name;
  }
  if (salon.prefectures?.name) {
    address.addressRegion = salon.prefectures.name;
  }
  if (salon.postal_code) {
    address.postalCode = salon.postal_code;
  }
  jsonLd.address = address;

  // Geo coordinates
  if (salon.lat != null && salon.lng != null) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: salon.lat,
      longitude: salon.lng,
    };
  }

  // Opening hours
  if (salon.business_hours) {
    jsonLd.openingHours = salon.business_hours;
  }

  // Aggregate rating
  if (avgRating !== null && reviews.length > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Individual reviews
  if (reviews.length > 0) {
    jsonLd.review = reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.profiles?.display_name ?? '匿名',
      },
      datePublished: review.created_at.slice(0, 10),
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.comment ?? undefined,
    }));
  }

  return jsonLd;
}

/**
 * Generate JSON-LD BreadcrumbList structured data
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD FAQPage structured data
 */
export function generateFAQJsonLd(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

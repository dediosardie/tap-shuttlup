import { Helmet } from "react-helmet-async";

const BASE_URL = "https://shuttlup.com";

// SoftwareApplication + Organization combined schema for the site
export function SiteStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/#software`,
        name: "Shutt'L Up",
        alternateName: "Shutt'L Up  VMMS",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: BASE_URL,
        description:
          "Shutt'L Up is a fleet and shuttle tracking SaaS system for enterprises in the Philippines. Provides real-time GPS tracking, trip ticket management, and transport analytics.",
        areaServed: {
          "@type": "Country",
          name: "Philippines",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "PHP",
          availability: "https://schema.org/OnlineOnly",
        },
        featureList: [
          "Real-time GPS fleet tracking",
          "Trip ticket management",
          "Barcode scanning",
          "Admin analytics dashboard",
          "AI assistant for scheduling",
          "Intersite shuttle coordination",
        ],
        screenshot: `${BASE_URL}/og-image.png`,
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Shutt'L Up",
        alternateName: "Shutt'L Up ",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/icon-512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://www.facebook.com/shuttlup",
          "https://www.linkedin.com/company/shuttlup",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            availableLanguage: ["English", "Filipino"],
            areaServed: "PH",
            url: `${BASE_URL}/contact`,
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressCountry: "PH",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Shutt'L Up",
        publisher: { "@id": `${BASE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Breadcrumb schema for inner pages
export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// FAQ schema for blog posts
export function FAQStructuredData({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Article schema for blog posts
export function ArticleStructuredData({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  authorName = "Shutt'L Up Team",
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    url: `${BASE_URL}${url}`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Organization",
      name: authorName,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Shutt'L Up",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon-512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}${url}`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Google Business Profile / LocalBusiness schema
export function LocalBusinessStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    name: "Shutt'L Up",
    url: BASE_URL,
    image: `${BASE_URL}/og-image.png`,
    description:
      "Shutt'L Up provides enterprise fleet tracking and shuttle management software for businesses in the Philippines.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PH",
      addressRegion: "Metro Manila",
    },
    areaServed: {
      "@type": "Country",
      name: "Philippines",
    },
    priceRange: "$$",
    openingHours: "Mo-Fr 09:00-18:00",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: `${BASE_URL}/contact`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

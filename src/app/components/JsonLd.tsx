export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dubon Services",
    "url": "https://dubonservice.com",
    "logo": "https://dubonservice.com/logo512.png",
    "description": "Découvrez Dubon Services Events : votre marketplace pour des produits frais, congelés, formations spécialisées, et services événementiels."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 
const ConfidentialitySection = () => {
  const sections = [
    {
      title: "LIVRAISON",
      icon: "🚚",
      desc: "Nous nous engageons à livrer vos commandes dans les délais les plus courts possibles.",
      details: `
        Nous collaborons avec des transporteurs fiables pour assurer la livraison de vos produits dans les meilleures conditions.
        Vous serez tenu informé(e) à chaque étape de la livraison, grâce à notre système de suivi en temps réel.
        Si un retard survient, nous nous engageons à vous en informer immédiatement et à trouver une solution adaptée.
      `,
    },
    {
      title: "RETOUR 24/24",
      icon: "🔄",
      desc: "Si vous n'êtes pas satisfait(e) de votre achat, vous pouvez effectuer un retour sous 24 heures.",
      details: `
        La satisfaction de nos clients est notre priorité absolue.
        Tous les retours sont traités rapidement et efficacement. Une équipe dédiée est à votre disposition pour vous accompagner dans le processus de retour.
        Les produits retournés doivent être dans leur état d'origine, avec leur emballage et leurs étiquettes.
      `,
    },
    {
      title: "SÉCURISÉ",
      icon: "🔒",
      desc: "Nous utilisons des technologies avancées de cryptage pour garantir la sécurité de vos paiements.",
      details: `
        Nous collaborons avec des prestataires de paiement de confiance pour garantir la confidentialité de vos informations bancaires.
        Toutes les transactions sont protégées par des protocoles de sécurité conformes aux normes internationales.
        En cas de doute ou d'activité suspecte, notre équipe est disponible 24/7 pour vous assister.
      `,
    },
    {
      title: "SUPPORT CLIENT 24/7",
      icon: "🎧",
      desc: "Notre équipe de support est disponible 24/7 pour répondre à toutes vos questions.",
      details: `
        Vous pouvez nous contacter via chat en direct, email ou téléphone. Notre équipe est formée pour répondre à toutes vos préoccupations rapidement.
        Des FAQ détaillées et des guides pratiques sont également disponibles sur notre site pour vous aider à trouver des solutions immédiatement.
        Nous nous engageons à résoudre tous vos problèmes dans un délai maximum de 24 heures.
      `,
    },
  ];

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold text-center mb-6">Confidentialité et Garanties</h2>
        <p className="text-center text-gray-600 mb-10">
          Nous mettons un point d&apos;honneur à protéger vos informations personnelles, à garantir vos paiements et à assurer votre satisfaction à travers nos services.
        </p>
        <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 lg:px-1">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-1/2 max-w-[120px] sm:max-w-[160px] md:max-w-[200px] bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-3xl mb-2">{section.icon}</div>
              <h3 className="font-bold text-sm sm:text-base mb-2">{section.title}</h3>
              <details className="text-xs sm:text-sm text-gray-700 cursor-pointer">
                <summary className="text-blue-700 font-semibold underline mb-1">
                  En savoir plus
                </summary>
                <p>{section.details}</p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConfidentialitySection;

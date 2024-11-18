const BenefitsSection = () => {
    const benefits = [
      { icon: "🚚", title: "RAPIDITÉ DE LIVRAISON", desc: "Remboursé en 24 heures" },
      { icon: "🔄", title: "RETOUR SUR 24 HEURES", desc: "Remboursement en cas de non satisfaction" },
      { icon: "🔒", title: "PAIEMENT SÉCURISÉ", desc: "Votre argent est bien gardé" },
      { icon: "🎧", title: "SUPPORT CLIENT 24/7", desc: "Live contact/message" },
    ];
  
    return (
      <section className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl">{benefit.icon}</div>
              <h4 className="font-bold mt-2">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default BenefitsSection;
  
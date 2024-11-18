import React from "react";

const Newsletter = () => {
  return (
    <section className="bg-customBlue text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-4">Rejoignez notre newsletter</h2>
            <p className="text-gray-200 mb-8">
            Soyez les premiers informés de nos nouvelles offres, promotions et produits exclusifs. 
            Inscrivez-vous dès maintenant !
            </p>


        {/* Subscription Form */}
        <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full sm:w-auto px-4 py-3 rounded-lg text-black focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-blue-800 font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center"
          >
            SUBSCRIBE
            <span className="ml-2">→</span>
          </button>
        </form>

        {/* Partner Logos */}
        <div className="mt-8 flex justify-center gap-8 flex-wrap">
          {/* <img src="/logos/google.png" alt="Google" className="h-8" />
          <img src="/logos/amazon.png" alt="Amazon" className="h-8" />
          <img src="/logos/philips.png" alt="Philips" className="h-8" />
          <img src="/logos/toshiba.png" alt="Toshiba" className="h-8" />
          <img src="/logos/samsung.png" alt="Samsung" className="h-8" /> */}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

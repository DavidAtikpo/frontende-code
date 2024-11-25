"use client";
import Image from "next/image";
import Link from "next/link";
const FormationPage = () => {
  return (
    <div>

    <nav className="text-gray-600 text-sm mb-6">
      <Link href="/" className="hover:underline">
        Accueil
      </Link>{" "}
      &gt;{" "}
      <Link href="/formation" className="hover:underline">
        Formation
      </Link>{" "}
      {/* / {product.title} */}
    </nav>
    <div className="bg-gray-50">
      {/* Section Principale */}
      <header className="bg-yellow-50 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Des compétences d&apos;aujourd&apos;hui qui ont de l&apos;avenir
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Notre différence ? Une formation 100 % en ligne et un modèle pédagogique unique qui seront
            les clés de votre réussite.
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <div className="bg-white p-6 rounded-lg w-64 text-left shadow">
              <h2 className="text-xl font-bold text-gray-800">Étudiants</h2>
              <p className="text-sm text-gray-600 mt-2">
                Faites un grand pas vers votre nouvelle carrière en suivant l&apos;une de nos formations
                diplômantes.
              </p>
              <button className="mt-4 bg-customBlue text-white px-4 py-2 rounded">
                Démarrer mon inscription
              </button>
              <button className="mt-2 text-customBlue underline">
                Découvrir les formations
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg w-64 text-left shadow">
              <h2 className="text-xl font-bold text-gray-800">Employeurs</h2>
              <p className="text-sm text-gray-600 mt-2">
                Recrutez des alternants quand vous en avez besoin et formez vos équipes à des
                compétences opérationnelles.
              </p>
              <button className="mt-4 bg-customBlue text-white px-4 py-2 rounded">
                Explorer l&apos;espace employeur
              </button>
              <button className="mt-2 text-customBlue underline">
                Découvrir nos offres business
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Section des Valeurs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Savoir. Faire. Savoir-faire.</h2>
          <p className="text-lg text-gray-600 mt-4">
            Avec OpenClassrooms, découvrez une nouvelle façon d’apprendre : 20 % de théorie, 80 % de
            pratique.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Image
                src="https://autoecolebertili.com/wp-content/uploads/2021/07/code-route-en-ligne2-apprenez.png"
                alt="Apprenez"
                className="w-24 h-24 mb-4 rounded-lg"
                width={64}
                height={64}
              />
              <h3 className="text-xl font-bold text-gray-800">Apprenez où que vous soyez</h3>
              <p className="text-gray-600 text-sm mt-2">
                Accédez à votre formation 100 % en ligne au bureau, à la maison, en ville, à la
                montagne… Partout !
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="https://allegiance-educare.in/storage/uploads/Mentoring-Pic-1.jpg"
                alt="Mentor"
                className="w-24 h-24 mb-4"
                width={64}
                height={64}
              />
              <h3 className="text-xl font-bold text-gray-800">Un mentor pour vous accompagner</h3>
              <p className="text-gray-600 text-sm mt-2">
                Bénéficiez des conseils d’un expert du métier qui vous aide à progresser tout au long
                de votre formation.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl3wU1tVtY_SGiGNgE5hAHFc27vjqx9USlQg&s"
                alt="Projets professionnels"
                className="w-24 h-24 mb-4"
                width={64}
                height={64}
              />
              <h3 className="text-xl font-bold text-gray-800">Travaillez sur des projets professionnalisants</h3>
              <p className="text-gray-600 text-sm mt-2">
                Réalisez des projets concrets, issus de scénarios métiers, directement applicables
                dans le monde du travail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="bg-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-800">
              Prêt à donner un nouvel élan à votre carrière ?
            </h3>
            <p className="text-gray-600 mt-4">
              Mettez à jour vos connaissances, développez de nouvelles compétences, obtenez une
              certification professionnelle… Quel que soit votre projet de carrière, nous sommes là
              pour vous conseiller et vous accompagner.
            </p>
            <a href="/formation/inscription">
            <button className="mt-6 bg-customBlue  text-white px-6 py-3 rounded">
              Démarrer mon inscription
            </button>
            </a>
            
          </div>
          <div className="lg:w-1/3 mt-8 lg:mt-0">
  <iframe
    className="rounded shadow w-full"
    width="560"
    height="315"
    src="https://www.youtube.com/embed/yUjxUkU-NPI?autoplay=1&mute=1"
    title="Vidéo promotionnelle"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>


        </div>
      </section>
    </div>
    </div>
  );
};

export default FormationPage;

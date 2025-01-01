"use client";

import React from 'react';
import Link from 'next/link';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CONDITIONS GÉNÉRALES D'UTILISATION (CGU)</h1>

      {/* Table des matières */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Table des matières</h2>
        <nav className="space-y-2">
          {sections.map((section, index) => (
            <Link 
              key={section.id} 
              href={`#${section.id}`}
              className="block text-blue-600 hover:underline"
            >
              {index + 1}. {section.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <section key={section.id} id={section.id} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            {index + 1}. {section.title}
          </h2>
          {section.subsections ? (
            <div className="space-y-6">
              {section.subsections.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <h3 className="text-xl font-semibold mb-3">
                    {index + 1}.{subIndex + 1}. {subsection.title}
                  </h3>
                  <div className="prose max-w-none">
                    {subsection.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="prose max-w-none">
              {section.content}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

const sections = [
  {
    id: 'preambule',
    title: 'Préambule',
    content: `Les présentes conditions générales d'utilisation (ci-après "CGU") régissent l'accès et l'utilisation des services de la plateforme de vente en ligne (ci-après "le Service"). Ce Service est fourni par [Nom de l'entreprise], dont le siège est situé à [adresse complète]. Ces CGU définissent les droits et obligations des parties, à savoir l'entreprise (ci-après "nous" ou "l'Entreprise") et les utilisateurs (ci-après "vous" ou "l'Utilisateur"). En utilisant le Service, vous acceptez expressément et sans réserve les présentes CGU. Il est recommandé de lire attentivement ce document avant d'accéder à nos services.`
  },
  {
    id: 'presentation',
    title: 'Présentation du Service',
    content: `Le Service consiste en une plateforme en ligne dédiée à la vente de biens et services via des représentants et des partenaires commerciaux. La plateforme permet aux utilisateurs d'accéder à une large gamme de produits et services proposés par des partenaires affiliés, et aux partenaires commerciaux de représenter et de vendre leurs produits via un canal numérique sécurisé.`
  },
  {
    id: 'acceptation',
    title: 'Acceptation des CGU',
    content: `L'utilisation du Service est subordonnée à l'acceptation intégrale et sans réserve des présentes CGU. Cette acceptation est matérialisée lors de l'inscription à la plateforme et vaut reconnaissance de leur opposabilité dans le cadre des relations entre l'Utilisateur, les partenaires et l'Entreprise. Si vous n'acceptez pas ces CGU, vous ne pouvez pas utiliser le Service.`
  },
  {
    id: 'acces',
    title: 'Accès au Service',
    content: `L'accès au Service est strictement conditionné à la création d'un compte personnel. L'Utilisateur s'engage à fournir des informations exactes, complètes et mises à jour lors de l'inscription, maintenir la confidentialité de ses identifiants de connexion et informer immédiatement l'Entreprise de toute utilisation non autorisée de son compte. L'accès au Service peut être restreint, suspendu ou résilié en cas de non-respect des présentes CGU ou en cas de fraude avérée.`
  },
  {
    id: 'responsabilite',
    title: "Responsabilité de l'Utilisateur",
    content: `L'Utilisateur est seul responsable de l'utilisation qu'il fait des fonctionnalités du Service, de la vérification de l'exactitude des informations fournies lors de la commande, et de la conformité de son utilisation avec les lois et réglementations en vigueur. Toute utilisation frauduleuse ou abusive du Service pourra entraîner la suspension immédiate du compte utilisateur et, le cas échéant, des poursuites judiciaires.`
  },
  {
    id: 'propriete',
    title: 'Propriété intellectuelle',
    content: `L'ensemble des éléments du Service (contenus, marques, logos, design, logiciels) est protégé par les lois sur la propriété intellectuelle. L'Utilisateur reconnaît que ces éléments sont la propriété exclusive de l'Entreprise ou de ses partenaires et s'engage à ne pas les reproduire, modifier ou distribuer sans autorisation préalable écrite. Toute atteinte à ces droits de propriété pourra entraîner des actions en justice.`
  },
  {
    id: 'modalites',
    title: 'Modalités des CGU',
    subsections: [
      {
        title: 'Utilisateurs : Paiements et obligations',
        content: `Les paiements effectués sur la plateforme sont sécurisés et traités via des prestataires certifiés. L'Utilisateur s'engage à honorer tout paiement dû lors de la validation d'une commande. En cas de non-paiement ou de rejet du paiement, l'Entreprise se réserve le droit d'annuler la commande ou de suspendre l'accès au Service.`
      },
      {
        title: 'Partenaires : Conformité et obligations',
        content: `Les partenaires doivent se conformer à la politique de confidentialité et aux CGU pour la représentation de leurs produits. Ils garantissent que les produits proposés sont conformes aux lois applicables et ne violent aucun droit tiers. Tout manquement aux obligations contractuelles pourra entraîner la résiliation de leur partenariat.`
      }
    ]
  },
  {
    id: 'limitation',
    title: 'Limitation de responsabilité',
    content: `L'Entreprise s'engage à fournir un Service conforme à ses descriptions, mais sa responsabilité est limitée dans les cas de dommages directs ou indirects résultant de l'utilisation du Service, d'indisponibilité temporaire ou permanente du Service pour des raisons techniques, et de pertes ou dommages causés par des tiers ou par une mauvaise utilisation du Service. En aucun cas, l'Entreprise ne saurait être tenue responsable au-delà des montants payés par l'Utilisateur pour les services concernés.`
  },
  {
    id: 'resiliation',
    title: 'Résiliation du Service',
    content: `L'Utilisateur peut résilier son compte à tout moment en adressant une demande écrite à l'Entreprise. L'Entreprise se réserve le droit de résilier l'accès au Service en cas de non-respect des CGU, d'utilisation frauduleuse ou abusive du Service, ou de non-paiement des sommes dues. En cas de résiliation, les données personnelles de l'Utilisateur seront supprimées conformément à la politique de confidentialité.`
  },
  {
    id: 'droit',
    title: 'Droit applicable et juridiction compétente',
    content: `Les présentes CGU sont régies par les lois de [pays]. En cas de litige relatif à l'interprétation ou à l'exécution des CGU, les parties conviennent de rechercher une solution amiable. À défaut d'accord amiable, le litige sera soumis à la compétence exclusive des tribunaux de [ville/pays], protégeant à la fois l'Entreprise et l'Utilisateur en clarifiant les droits et obligations des parties.`
  },
  {
    id: 'modification',
    title: 'Modification des CGU',
    content: `L'Entreprise se réserve le droit de modifier les présentes CGU à tout moment pour s'adapter aux évolutions légales ou techniques. Les utilisateurs seront informés de toute modification par une notification sur l'application ou par email, et devront accepter les nouvelles CGU pour continuer à utiliser le Service.`
  }
];

export default TermsPage; 
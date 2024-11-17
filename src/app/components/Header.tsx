import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">Accueil</Link>
        <Link href="/products">Produits</Link>
        <Link href="/cart">Panier</Link>
        <Link href="/account">Mon Compte</Link>
      </nav>
    </header>
  );
}

import Link from "next/link";

export default function Kontakt() {
  return (
    <main>
      {/* Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-green-800">Egene Ridecenter</Link>
        <ul className="flex gap-6 text-sm font-medium text-gray-600">
          <li><Link href="/" className="hover:text-green-800">Forside</Link></li>
          <li><Link href="/kontakt" className="hover:text-green-800">Kontakt</Link></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="bg-green-800 text-white text-center py-20 px-6">
        <h1 className="text-4xl font-bold mb-3">Kontakt os</h1>
        <p className="text-lg">Vi sidder klar til at svare på dine spørgsmål</p>
      </section>

      {/* Kontaktinfo */}
      <section className="max-w-2xl mx-auto px-6 py-16 grid gap-8">
        <div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Adresse</h2>
          <p className="text-gray-600">Egene Ridecenter<br />Nordsjælland</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Telefon</h2>
          <p className="text-gray-600">+45 00 00 00 00</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Email</h2>
          <p className="text-gray-600">kontakt@egene.dk</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Find os på</h2>
          <p className="text-gray-600">Facebook · Instagram</p>
        </div>
      </section>
    </main>
  );
}

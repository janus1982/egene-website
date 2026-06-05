export default function Home() {
  return (
    <main>
      {/* Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-green-800">Egene Ridecenter</span>
        <ul className="flex gap-6 text-sm font-medium text-gray-600">
          <li><a href="#" className="hover:text-green-800">Rideskole</a></li>
          <li><a href="#" className="hover:text-green-800">Ridecenter</a></li>
          <li><a href="#" className="hover:text-green-800">Om os</a></li>
          <li><a href="#" className="hover:text-green-800">Events</a></li>
          <li><a href="#" className="hover:text-green-800">Kontakt</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="bg-green-800 text-white text-center py-24 px-6">
        <h1 className="text-5xl font-bold mb-4">Egene Ridecenter</h1>
        <p className="text-xl mb-8">Et af Nordsjællands smukkest beliggende ridecentre</p>
        <div className="flex justify-center gap-4">
          <a href="#" className="bg-white text-green-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100">
            Se rideskolen
          </a>
          <a href="#" className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700">
            Kontakt os
          </a>
        </div>
      </section>

      {/* Tre kolonner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-16 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-3">Rideskole</h2>
          <p className="text-gray-600">Vi tilbyder undervisning for alle niveauer — fra begyndere til øvede ryttere.</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-3">Opstaldning</h2>
          <p className="text-gray-600">Moderne faciliteter og daglig pleje til din hest i naturskønne omgivelser.</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-3">Events</h2>
          <p className="text-gray-600">Stævner, lejre og arrangementer gennem hele året for store og små.</p>
        </div>
      </section>
    </main>
  );
}

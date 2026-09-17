import { useState } from 'react'
import './App.css'

import { VwCatalogue } from './components/VwCatalogue'
import { FinanceEnquiryForm } from './components/FinanceEnquiryForm'
import { FindMyCarEnquiryForm } from './components/FindMyCarEnquiryForm'
import { AccDashboard } from './components/AccDashboard'

import type { Vehicle } from './services/vehicleService'

type View = 'home' | 'inventory' | 'finance' | 'find' | 'acc'

function App() {
  const [view, setView] = useState<View>('home')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const handleSelectVehicleForFinance = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setView('finance')

    setTimeout(() => {
      document.getElementById('finance')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  const financeVehicleName = selectedVehicle
    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}${selectedVehicle.derivative ? ` ${selectedVehicle.derivative}` : ''}`
    : '2024 VW Polo TSI'

  if (view === 'acc') {
    return (
      <div className="min-h-screen bg-[#101010]">
        <AccDashboard onExit={() => setView('home')} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white">
      {/* PLM HEADER */}
      <header className="sticky top-0 z-50 bg-[#101010]/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setView('home')}
            className="text-left"
          >
            <div className="text-lg font-black tracking-tight">
              PRIME LANE MOTORS
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
              Volkswagen Vehicle Solutions
            </div>
          </button>

          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView('inventory')}
              className="px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white"
            >
              Inventory
            </button>

            <button
              type="button"
              onClick={() => setView('finance')}
              className="px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white"
            >
              Finance
            </button>

            <button
              type="button"
              onClick={() => setView('find')}
              className="px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white"
            >
              Find My Car
            </button>
          </nav>
        </div>
      </header>

      {/* HOME */}
      {view === 'home' && (
        <main>
          <section className="max-w-7xl mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                PLM Vehicle Network
              </span>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Find Your Volkswagen.
                <br />
                Finance With Confidence.
              </h1>

              <p className="mt-5 max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed">
                Browse available Volkswagen vehicles, request finance
                assistance, or let Prime Lane Motors find the right vehicle
                for your requirements.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setView('inventory')}
                  className="px-5 py-3 bg-white text-black rounded-xl text-xs font-black hover:bg-zinc-200"
                >
                  Browse VW Inventory
                </button>

                <button
                  type="button"
                  onClick={() => setView('find')}
                  className="px-5 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-700"
                >
                  Find My Car
                </button>
              </div>
            </div>
          </section>

          <section className="border-y border-zinc-800 bg-[#131313]">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-xl font-black">Live Stock</div>
                <p className="text-xs text-zinc-500 mt-1">
                  Vehicle information supplied through the connected inventory
                  service.
                </p>
              </div>

              <div>
                <div className="text-xl font-black">Finance Support</div>
                <p className="text-xs text-zinc-500 mt-1">
                  Submit your enquiry and let the dealership process guide the
                  next step.
                </p>
              </div>

              <div>
                <div className="text-xl font-black">PLM Sales Support</div>
                <p className="text-xs text-zinc-500 mt-1">
                  Your enquiry is routed into the PLM sales workflow.
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* INVENTORY */}
      {view === 'inventory' && (
        <main>
          <VwCatalogue
            onSelectVehicleForFinance={handleSelectVehicleForFinance}
          />
        </main>
      )}

      {/* FINANCE */}
      {view === 'finance' && (
        <main
          id="finance"
          className="max-w-3xl mx-auto px-4 py-10"
        >
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setView('inventory')}
              className="text-xs font-bold text-zinc-400 hover:text-white"
            >
              ← Back to Inventory
            </button>
          </div>

          <FinanceEnquiryForm
            vehicleInterestDefault={financeVehicleName}
          />
        </main>
      )}

      {/* FIND MY CAR */}
      {view === 'find' && (
        <main className="max-w-3xl mx-auto px-4 py-10">
          <FindMyCarEnquiryForm />
        </main>
      )}

      {/* INTERNAL ACCESS */}
      <footer className="border-t border-zinc-800 bg-[#101010] mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
            Prime Lane Motors
          </span>

          <button
            type="button"
            onClick={() => setView('acc')}
            className="text-[10px] font-bold text-zinc-600 hover:text-zinc-300"
          >
            Sales Command Centre
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App

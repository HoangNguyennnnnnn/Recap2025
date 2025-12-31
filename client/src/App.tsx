import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-deep-blue flex flex-col items-center justify-center p-8">
      <h1 className="font-dancing text-6xl text-stardust-gold mb-8">
        Love Universe 2025
      </h1>
      <p className="font-inter text-soft-pink text-xl mb-6">
        A journey through our memories together
      </p>
      <button
        onClick={() => setCount((count) => count + 1)}
        className="bg-stardust-gold hover:bg-yellow-500 text-deep-blue font-inter font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Count: {count}
      </button>
      <p className="font-inter text-gray-300 mt-8 text-sm">
        Built with Vite + React + TypeScript + Tailwind CSS
      </p>
    </div>
  )
}

export default App

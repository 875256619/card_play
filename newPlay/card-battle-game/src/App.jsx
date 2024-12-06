import GameBoard from './components/GameBoard'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        卡牌对战游戏
      </h1>
      <GameBoard />
    </div>
  )
}

export default App
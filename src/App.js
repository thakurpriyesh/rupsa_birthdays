import React, { useState, useEffect } from 'react';

// --- STYLES & ANIMATIONS ---
const customStyles = `
  body {
    font-family: 'Georgia', serif;
    margin: 0;
    overflow-x: hidden;
    background-color: #fdf2f8;
  }

  .font-handwriting {
    font-family: 'Georgia', serif;
    font-style: italic;
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 32px 0 rgba(255, 182, 193, 0.3);
  }

  .float {
    animation: float 6s ease-in-out infinite;
  }
  
  .float-delayed {
    animation: float 6s ease-in-out 3s infinite;
  }

  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  .card-flip {
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .card-flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
  }

  .animate-pop {
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  .candle-flame {
    animation: flicker 0.5s infinite alternate;
  }

  @keyframes flicker {
    0% { transform: scale(1) rotate(-3deg); opacity: 0.9; }
    50% { transform: scale(1.1) rotate(3deg); opacity: 1; }
    100% { transform: scale(0.95) rotate(-1deg); opacity: 0.8; }
  }
`;

// --- COMPONENTS ---

const FloatingBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className={`absolute text-2xl opacity-40 ${i % 2 === 0 ? 'float' : 'float-delayed'}`}
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDuration: `${Math.random() * 4 + 4}s`,
            fontSize: `${Math.random() * 20 + 15}px`
          }}
        >
          {['🌸', '✨', '💖', '🦋', '🎀'][i % 5]}
        </div>
      ))}
    </div>
  );
};

const LandingScreen = ({ onStart }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 animate-pop">
    <div className="glass-panel p-10 rounded-3xl max-w-lg w-full text-center">
      <div className="text-6xl mb-4 float">👑</div>
      <h1 className="text-4xl md:text-5xl font-black text-rose-500 mb-2 tracking-tight">
        Happy 21st, <span className="text-pink-600 font-handwriting text-6xl block mt-2">Rupsa!</span>
      </h1>
      <p className="text-gray-600 text-lg mb-8 font-medium">
        Welcome to your premium birthday experience. I made a little something just for you.
      </p>
      <button 
        onClick={onStart}
        className="bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full md:w-auto"
      >
        Let's Begin ✨
      </button>
    </div>
  </div>
);

const MemoryGame = ({ onWin }) => {
  const icons = ['🌸', '🍓', '🧸', '💌', '🎀', '🐶'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const shuffledCards = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon }));
    setCards(shuffledCards);
  }, []);

  useEffect(() => {
    if (solved.length === icons.length * 2) {
      setTimeout(onWin, 1500);
    }
  }, [solved]);

  const handleCardClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 animate-pop">
      <div className="glass-panel p-6 md:p-10 rounded-3xl max-w-xl w-full text-center">
        <h2 className="text-3xl font-black text-rose-500 mb-2">Unlock Your Gift 🎁</h2>
        <p className="text-gray-600 mb-8 font-medium">Match all the cute doodles to reveal your birthday surprise!</p>
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 perspective-1000">
          {cards.map((card, idx) => (
            <div 
              key={card.id}
              className="relative w-full aspect-square cursor-pointer perspective"
              onClick={() => handleCardClick(idx)}
            >
              <div className={`w-full h-full card-flip ${flipped.includes(idx) || solved.includes(idx) ? 'card-flipped' : ''}`}>
                {/* Front of card (hidden by default) */}
                <div className="card-face bg-white/70 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-rose-100">
                  💖
                </div>
                {/* Back of card (revealed on flip) */}
                <div className="card-face card-back bg-white rounded-2xl flex items-center justify-center text-5xl shadow-md border-2 border-pink-200">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BirthdayCake = ({ onContinue }) => {
  const [candlesLit, setCandlesLit] = useState(true);

  const blowOutCandles = () => {
    setCandlesLit(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 animate-pop">
      {!candlesLit && <Confetti />}
      <div className="glass-panel p-10 rounded-3xl max-w-lg w-full text-center">
        <h2 className="text-3xl font-black text-rose-500 mb-6">Make a Wish, Rupsa! 🎂</h2>
        
        <div className="relative mx-auto mb-8 w-72 h-72 cursor-pointer" onClick={blowOutCandles}>
          {/* Premium SVG Cake to ensure perfect alignment */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Plate */}
            <ellipse cx="100" cy="180" rx="85" ry="20" fill="#cbd5e1" />
            <ellipse cx="100" cy="175" rx="80" ry="18" fill="#f8fafc" />
            
            {/* Bottom Tier (Cake) */}
            <path d="M 30 170 L 30 120 Q 100 140 170 120 L 170 170 Q 100 190 30 170 Z" fill="#fbcfe8" />
            <ellipse cx="100" cy="120" rx="70" ry="20" fill="#f9a8d4" />
            
            {/* Top Tier (Frosting/Cake) */}
            <path d="M 50 120 L 50 70 Q 100 85 150 70 L 150 120 Q 100 135 50 120 Z" fill="#fce7f3" />
            <ellipse cx="100" cy="70" rx="50" ry="15" fill="#fff1f2" />
            
            {/* Frosting Drips */}
            <path d="M 50 120 Q 60 140 70 120 Q 85 145 100 125 Q 115 150 130 120 Q 140 135 150 120 Z" fill="#fff1f2" />
            <path d="M 30 170 Q 45 185 65 170 Q 85 190 100 175 Q 120 195 140 170 Q 155 185 170 170 Z" fill="#f9a8d4" />

            {/* Candles */}
            <g className="transition-opacity duration-500">
              {/* Left Candle */}
              <rect x="70" y="30" width="8" height="40" fill="#fef08a" rx="4" />
              <rect x="70" y="35" width="8" height="5" fill="#fde047" />
              <rect x="70" y="45" width="8" height="5" fill="#fde047" />
              <rect x="70" y="55" width="8" height="5" fill="#fde047" />
              {candlesLit && <path d="M 74 10 Q 80 20 74 30 Q 68 20 74 10 Z" fill="#f97316" className="candle-flame" style={{transformOrigin: '74px 30px'}} />}
              
              {/* Middle Candle */}
              <rect x="96" y="20" width="8" height="50" fill="#bfdbfe" rx="4" />
              <rect x="96" y="25" width="8" height="5" fill="#93c5fd" />
              <rect x="96" y="35" width="8" height="5" fill="#93c5fd" />
              <rect x="96" y="45" width="8" height="5" fill="#93c5fd" />
              <rect x="96" y="55" width="8" height="5" fill="#93c5fd" />
              {candlesLit && <path d="M 100 0 Q 106 10 100 20 Q 94 10 100 0 Z" fill="#f97316" className="candle-flame" style={{transformOrigin: '100px 20px'}} />}
              
              {/* Right Candle */}
              <rect x="122" y="30" width="8" height="40" fill="#fef08a" rx="4" />
              <rect x="122" y="35" width="8" height="5" fill="#fde047" />
              <rect x="122" y="45" width="8" height="5" fill="#fde047" />
              <rect x="122" y="55" width="8" height="5" fill="#fde047" />
              {candlesLit && <path d="M 126 10 Q 132 20 126 30 Q 120 20 126 10 Z" fill="#f97316" className="candle-flame" style={{transformOrigin: '126px 30px'}} />}
            </g>

            {/* 21 Text */}
            <text x="100" y="155" textAnchor="middle" fill="#ec4899" fontSize="28" fontWeight="bold" fontFamily="Quicksand, sans-serif">21</text>
          </svg>

          {candlesLit && (
             <div className="absolute -bottom-2 left-0 w-full text-sm text-gray-500 animate-pulse font-bold">
               (Tap the cake to blow out the candles!)
             </div>
          )}
        </div>

        {!candlesLit && (
          <div className="animate-pop mt-4">
            <p className="text-xl text-pink-600 font-bold mb-6">Yay! Your wish is locked in. ✨</p>
            <button 
              onClick={onContinue}
              className="bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Read Your Letter 💌
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `-5vh`,
            animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
            animationDelay: `${Math.random() * 2}s`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: ['#ffb6c1', '#ff69b4', '#ffc0cb', '#f0e68c', '#87cefa'][Math.floor(Math.random() * 5)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(720deg); }
        }
      `}</style>
    </div>
  );
};

const LoveLetter = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 animate-pop">
      <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-2xl w-full relative">
        <div className="absolute -top-6 -left-6 text-6xl transform -rotate-12">🎀</div>
        <div className="absolute -bottom-6 -right-6 text-6xl transform rotate-12">🧸</div>
        
        <h2 className="font-handwriting text-5xl text-rose-500 mb-8 text-center">
  My Beautiful Rupsa,
</h2>

<div className="space-y-5 text-gray-800 text-lg leading-relaxed font-medium">
  <p>
    Happy 21st Birthday, my love.
  </p>
  <p>
    It honestly feels surreal writing this—like time has moved both so fast and so gently at the same time. I still remember how it felt when we first came into each other’s lives, and now here you are, stepping into such a beautiful new chapter. And somehow, you just keep becoming more incredible with every passing day.
  </p>
  <p>
    Today is about you—everything that makes you <span className="text-pink-600 font-bold italic">you</span>. The way you light up a room without even trying. The softness in your smile that somehow makes everything feel okay. Your warmth, your little quirks, your cuteness… all the things that make my world brighter just by existing in it. You have this quiet magic about you that I don’t think you even fully realize, but I feel it every single day.
  </p>
  <p>
    I am so deeply proud of the person you are. Not just for the big things, but for the way you carry yourself, the way you love, and the way you care. You make life feel lighter, more meaningful, and more worth holding onto.
  </p>
  <p>
    Whenever life feels uncertain, I find myself coming back to one simple question: <span className="text-pink-600 font-bold italic">"What will make us stronger?"</span> And every time, it leads me back to you. Because you are the most important part of my world. Choosing you, choosing us—it’s never a question. It’s the easiest, most certain thing I know.
  </p>
  <p>
    I hope today wraps you in the same happiness you give me so effortlessly. Let’s celebrate you properly, eat way too much cake, and make this a birthday you’ll always remember—because you deserve nothing less.
  </p>
  <p>
    Happy Birthday, my beautiful Rupsa. You mean more to me than I could ever fully put into words.
  </p>
</div>
        
        <div className="mt-12 text-right">
          <p className="text-gray-500 mb-2 font-bold uppercase tracking-widest text-sm">Forever Yours,</p>
          <p className="font-handwriting text-5xl text-rose-500">Priyesh 💖</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [stage, setStage] = useState('landing'); // landing, game, cake, letter

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 relative">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <FloatingBackground />
      
      {stage === 'landing' && <LandingScreen onStart={() => setStage('game')} />}
      {stage === 'game' && <MemoryGame onWin={() => setStage('cake')} />}
      {stage === 'cake' && <BirthdayCake onContinue={() => setStage('letter')} />}
      {stage === 'letter' && <LoveLetter />}
    </div>
  );
}
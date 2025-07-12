import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_URL = 'http://localhost:3001/cards';
const CARD_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'; // A beautiful Unsplash image
const DEFAULT_CARDS = [
  { number: 1, title: 'Card 1', description: 'This is card number 1.' },
  { number: 2, title: 'Card 2', description: 'This is card number 2.' },
  { number: 3, title: 'Card 3', description: 'This is card number 3.' },
  { number: 4, title: 'Card 4', description: 'This is card number 4.' },
  { number: 5, title: 'Card 5', description: 'This is card number 5.' },
  { number: 6, title: 'Card 6', description: 'This is card number 6.' },
  { number: 7, title: 'Card 7', description: 'This is card number 7.' },
];

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCards(res.data);
    } catch (err) {
      alert('Failed to fetch cards');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCards(cards.filter(card => card.id !== id));
    } catch (err) {
      alert('Failed to delete card');
    }
  };

  // Find the lowest missing card number from 1-7
  const getLowestMissingCard = () => {
    const presentNumbers = cards.map(card => {
      const match = card.title && card.title.match(/Card (\d+)/);
      return match ? parseInt(match[1], 10) : null;
    }).filter(Boolean);
    for (let i = 1; i <= 7; i++) {
      if (!presentNumbers.includes(i)) {
        return DEFAULT_CARDS[i - 1];
      }
    }
    return null;
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      const missingCard = getLowestMissingCard();
      let newCard;
      if (missingCard) {
        newCard = {
          title: missingCard.title,
          description: missingCard.description,
          image: CARD_IMAGE
        };
      } else {
        const nextNumber = cards.length + 1;
        newCard = {
          title: `Card ${nextNumber}`,
          description: `This is card number ${nextNumber}.`,
          image: CARD_IMAGE
        };
      }
      const res = await axios.post(API_URL, newCard);
      setCards([...cards, res.data]);
    } catch (err) {
      alert('Failed to add card');
    }
    setAdding(false);
  };

  return (
    <div className="container">
      <h1>Card List</h1>
      <div className="add-btn-row">
        <button className="add-btn-top" onClick={handleAdd} disabled={adding} title="Add Card">
          <span className="add-icon">+</span> <span>Add Card</span>
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-list">
          <AnimatePresence>
            {cards
              .slice()
              .sort((a, b) => {
                const getNum = (card) => {
                  const match = card.title && card.title.match(/Card (\d+)/);
                  return match ? parseInt(match[1], 10) : 9999;
                };
                return getNum(a) - getNum(b);
              })
              .map((card, idx) => (
                <motion.div
                  className="card"
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  <div className="card-img-wrap">
                    <img
                      className="card-img"
                      src={CARD_IMAGE}
                      alt={card.title}
                    />
                  </div>
                  <h2 title={card.title}>{card.title}</h2>
                  <p>{card.description}</p>
                  <button className="delete-btn" onClick={() => handleDelete(card.id)}>
                    &#128465; Delete
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default App;

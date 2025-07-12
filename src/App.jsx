import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_URL = 'http://localhost:3001/cards';

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

  const handleAdd = async () => {
    setAdding(true);
    try {
      const newCard = {
        title: `Card ${cards.length + 1}`,
        description: `This is card number ${cards.length + 1}.`
      };
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
      <button className="add-btn" onClick={handleAdd} disabled={adding}>
        {adding ? 'Adding...' : 'Add Card'}
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-list">
          <AnimatePresence>
            {cards.map(card => (
              <motion.div
                className="card"
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                <h2>{card.title}</h2>
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

import { useEffect, useState } from "react";
import "./AdviceApp.css";

export const AdviceApp = () => {
  const [advice, setAdvice] = useState("Click the button to get advice!");
  const [count, setCount] = useState(0);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdvice();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  async function getAdvice() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();
      setAdvice(data.slip.advice);
      setCount((prevCount) => prevCount + 1);
    } catch (err) {
      setError("Failed to fetch advice. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function toggleDarkMode() {
    setDarkMode((prevMode) => !prevMode);
  }

  function addToFavorites() {
    if (!favorites.includes(advice)) {
      setFavorites((prev) => [...prev, advice]);
    }
  }

  return (
    <div className={darkMode ? "advice-app dark" : "advice-app"}>
      <div className="advice-container">
        <h1 className="app-title">Advice App</h1>
        <h3 className="advice-text">
          {loading ? "Loading advice..." : error ? error : `"${advice}"`}
        </h3>
        <div className="buttons">
          <button className="btn" onClick={getAdvice} disabled={loading}>
            Get Advice
          </button>
          <button className="btn favorite" onClick={addToFavorites}>
            Add to Favorites
          </button>
          <button className="btn toggle" onClick={toggleDarkMode}>
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
        <Counter count={count} />
        {favorites.length > 0 && (
          <div className="favorites">
            <h4>Favorite Advice</h4>
            <div className="favorites-list">
              {favorites.map((fav, index) => (
                <div key={index} className="favorite-item">
                  {fav}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className="footer">
        <div className="footer-content">
          <p>Developed by <b><a href="https://sujith-flame.vercel.app/">Sujith</a></b></p>
        </div>
      </footer>
    </div>
  );
};

function Counter(props) {
  return (
    <p className="counter-text">
      You have read <b>{props.count}</b> piece{props.count === 1 ? "" : "s"} of advice.
    </p>
  );
}

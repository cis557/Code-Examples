import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="box photo" id="x1">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Paracas_National_Reserve%2C_Ica%2C_Peru-3April2011.jpg" width="200" height="200" alt="Sea"></img>
        </div>

        <div className="box photo" id="x2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Agasthiyamalai_range_and_Tirunelveli_rainshadow.jpg" width="200" height="200" alt="Desert"></img>
        </div>

        <div className="box photo" id="x3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/P%C3%A5ske.jpg" width="200" height="200" alt="Snow"></img>
        </div>

        <div className="box text" id="x4"><span className="word">This is the first text box.</span></div>

        <div className="box text" id="x5"><span className="word">This is the second text box.</span></div>

        <div className="box text" id="x6"><span className="word">This is the third text box.</span></div>

      </div>
    </div>
  );
}

export default App;

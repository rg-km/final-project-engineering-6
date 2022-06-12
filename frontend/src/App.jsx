import "./App.scss";
import Forum from "./pages/Forum/Forum";
import ForumDetail from "./pages/ForumDetail/ForumDetail";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Forum />
        <ForumDetail />
      </BrowserRouter>
    </div>
  );
}

export default App;

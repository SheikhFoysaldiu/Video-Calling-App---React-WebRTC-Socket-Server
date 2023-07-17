import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Lobby from './component/Lobby/Lobby';
import Room from './component/Room/Room';
import { ContextProvider } from "./context/context";

function App() {



  return (
<BrowserRouter>
      <ContextProvider>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomID" element={<Room />} />
      </Routes>
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;

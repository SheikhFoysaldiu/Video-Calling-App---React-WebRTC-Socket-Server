import { useContext, useState } from "react";
import "./Lobby.css";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../../../frontend/src/context/context";

function Lobby() {
  const { JoinRoom } = useContext(SocketContext);

  const [roomID, setRoomID] = useState("");
  const [emailID, setEmailID] = useState("");
  console.log(roomID);

  const handleSubmit = (e) => {
    e.preventDefault();
    JoinRoom({roomID, emailID});
   
  };
  return (
    <div className="App">
      <main id="lobby-container">
        <div id="form-container">
          <div id="form__container__header">
            <p>👋 Create OR Join a Room</p>
          </div>

          <div id="form__content__wrapper">
            <form id="join-form" onSubmit={handleSubmit}>
              <input
                value={roomID}
                placeholder="RoomID"
                onChange={(e) => setRoomID(e.target.value)}
                type="text"
                name="invite_link"
                required
              />
              <input
                placeholder="EmailID"
                value={emailID}
                onChange={(e) => setEmailID(e.target.value)}
                type="text"
                name="invite_link"
                required
              />
              <input type="submit" value="Join Room" />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Lobby;

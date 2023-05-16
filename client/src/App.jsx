import { useEffect, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import Chat from "./assets/Chat";

const socket = io("ws://localhost:8000");

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* flex-direction: column; */
  min-height: 100vh;
`;

const LoginBox = styled.form`
  width: 15em;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1em;

  h1 {
    text-transform: capitalize;
  }
`;

const InputBox = styled.input`
  padding: 0.5em;
  font-size: 1.1em;
  width: 100%;
`;

const Button = styled.button`
  background-color: #056d05;
  font-size: 1.1em;
  padding: 0.5em;
  color: #fff;
  border-radius: 0.5em;
  border: none;
  width: 100%;
  cursor: pointer;
`;

function App() {
  const [username, setUsername] = useState("");

  const [room, setRoom] = useState("");

  const [showChat, setShowChat] = useState(false);

  const Join_Room = (e) => {
    e.preventDefault();
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);

      setShowChat(true);
    }
  };

  return (
    <Container>
      {!showChat ? (
        <LoginBox onSubmit={(e) => Join_Room(e)}>
          <h1>Join a room</h1>
          <InputBox
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <InputBox
            type="text"
            placeholder="Enter room name"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          />
          <Button>Join</Button>
        </LoginBox>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </Container>
  );
}

export default App;

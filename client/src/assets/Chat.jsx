import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Chatbox = styled.div`
  width: 20em;
  display: flex;
  flex-direction: column;
  border-radius: 2em;
  height: 30em;
  border: 1px solid #222;
  overflow: hidden;
`;

const Header = styled.div`
  height: 15%;
  background-color: #222;
  display: flex;
  align-items: center;
  padding: 0.5em;
  color: #fff;
`;

const Messages = styled.ul`
  height: 75%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  list-style-type: none;
  gap: 1.5em;
  overflow-y: scroll;

  & {
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Chats = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const NextChat = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const SenderChat = styled.li`
  display: flex;
  flex-direction: column;
  background-color: green;
  padding: 0.3em;
  color: white;
  border-radius: 0.5em;
  position: relative;
  left: 0;
  width: fit-content;
`;

const ReceiverChat = styled.li`
  display: flex;
  flex-direction: column;
  background-color: #1276cd;
  padding: 0.3em;
  color: white;
  border-radius: 0.5em;
  position: relative;
  width: fit-content;
  right: 0;
`;

const UserName = styled.small`
  color: #fff;
  font-weight: 800;
  font-size: 0.7em;
`;

const Time = styled.small`
  position: absolute;
  top: 100%;
  right: ${(props) => props.move === "right" && "0"};
  left: ${(props) => props.move === "left" && "0"};
  color: #222;
  font-size: 0.7em;
`;

const Input = styled.form`
  height: 10%;
  display: flex;
  width: 100%;

  input {
    width: 80%;
    padding: 0.5em;
    outline: none;
    border: 2px solid #236728;
  }

  button {
    width: 20%;
    border: none;
    background-color: #077907;
    color: #fff;
  }
`;

const Chat = ({ socket, username, room }) => {
  const MessageListRef = useRef();
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message !== "") {
      const Message = {
        room: room,
        username: username,
        message: message,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
      };
      setMessage("");

      await socket.emit("send_message", Message);

      setChatList((prev) => [...prev, Message]);

      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setChatList((prev) => [...prev, data]);
    });
  }, [socket]);

  useEffect(() => {
    MessageListRef.current.scrollTo(0, MessageListRef.current.scrollHeight);
  });

  return (
    <Container>
      <Chatbox>
        <Header>JOIN ROOM</Header>
        <Messages ref={MessageListRef}>
          {chatList.map((ele, id) =>
            ele.username === username ? (
              <Chats key={id}>
                <SenderChat>
                  <UserName>{ele.username}</UserName>
                  {ele.message} <Time move="right">{ele.time}</Time>
                </SenderChat>
              </Chats>
            ) : (
              <NextChat key={id}>
                <ReceiverChat>
                  <UserName>{ele.username}</UserName>
                  {ele.message}
                  <Time move="left">{ele.time}</Time>
                </ReceiverChat>
              </NextChat>
            )
          )}
        </Messages>

        <Input onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Enter</button>
        </Input>
      </Chatbox>
    </Container>
  );
};

export default Chat;

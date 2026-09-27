import { useState } from "react";
import AuthForm from "./components/AuthForm";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [credentials, setCredentials] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const handleLogin = (creds) => {
    setCredentials(creds);
  };

  const handleCreateChat = (chatId) => {
    if (!chats.includes(chatId)) {
      setChats([...chats, chatId]);
    }
    setActiveChat(chatId);
  };

  const handleLogout = () => {
    setCredentials(null);
    setChats([]);
    setActiveChat(null);
  };

  if (!credentials) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 flex flex-col border-r bg-white">
        <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <span className="font-bold">Green API Chat</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-300 hover:text-white"
          >
            Выйти
          </button>
        </div>
        <ChatList
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onCreateChat={handleCreateChat}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <ChatWindow credentials={credentials} chatId={activeChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
            <p>Выберите чат или создайте новый</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

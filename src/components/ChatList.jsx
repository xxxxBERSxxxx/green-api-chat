import { useState } from "react";

const ChatList = ({ chats, activeChat, onSelectChat, onCreateChat }) => {
  const [newChatId, setNewChatId] = useState("");

  const handleCreate = () => {
    const trimmed = newChatId.trim();
    if (!trimmed) {
      alert("Введите номер телефона или chatId");
      return;
    }

    let chatId;

    if (trimmed.includes("@")) {
      chatId = trimmed;
    } else {
      const cleanPhone = trimmed.replace(/\D/g, "");
      if (cleanPhone.length < 10) {
        alert("Введите корректный номер телефона");
        return;
      }
      chatId = `${cleanPhone}@c.us`;
    }

    onCreateChat(chatId);
    setNewChatId("");
  };

  return (
    <div className="w-1/3 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg mb-2">Чаты</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Номер или chatId"
            value={newChatId}
            onChange={(e) => setNewChatId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1 p-2 border rounded text-sm"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Для Telegram: 79999999999 или 79999999999@c.us
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="p-4 text-gray-500 text-center text-sm">
            Нет активных чатов
          </p>
        ) : (
          chats.map((chatId) => (
            <div
              key={chatId}
              onClick={() => onSelectChat(chatId)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                activeChat === chatId
                  ? "bg-green-50 border-l-4 border-green-500"
                  : ""
              }`}
            >
              <p className="font-medium text-gray-800">
                {chatId.split("@")[0]}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;

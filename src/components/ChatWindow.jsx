import { useState, useEffect, useRef } from "react";
import {
  sendMessage,
  receiveNotification,
  deleteNotification,
} from "../api/greenApi";

const ChatWindow = ({ credentials, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const isPollingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setMessages((prev) => [
      ...prev,
      {
        text: textToSend,
        sender: "me",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInputText("");

    try {
      await sendMessage(
        credentials.idInstance,
        credentials.apiTokenInstance,
        chatId,
        textToSend,
      );
    } catch (error) {
      alert("Ошибка отправки сообщения");
    }
  };

  useEffect(() => {
    if (!credentials.idInstance || !chatId) return;
    if (isPollingRef.current) return;

    isPollingRef.current = true;
    let isCancelled = false;

    const currentChatDigits = chatId.replace(/\D/g, "");

    const poll = async () => {
      while (!isCancelled) {
        try {
          const notification = await receiveNotification(
            credentials.idInstance,
            credentials.apiTokenInstance,
          );

          if (notification) {
            const { body, receiptId } = notification;

            if (body.typeWebhook === "incomingMessageReceived") {
              const senderChatId = body.senderData?.chatId || "";
              const senderPhone = body.senderData?.senderPhoneNumber || "";

              const senderChatDigits = String(senderChatId).replace(/\D/g, "");
              const senderPhoneDigits = String(senderPhone).replace(/\D/g, "");

              const isMatching =
                (senderChatDigits && senderChatDigits === currentChatDigits) ||
                (senderPhoneDigits && senderPhoneDigits === currentChatDigits);

              if (isMatching) {
                const messageText =
                  body.messageData?.textMessageData?.textMessage ||
                  body.messageData?.extendedTextMessageData?.text ||
                  body.messageData?.textMessage;

                if (messageText) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      text: messageText,
                      sender: "them",
                      timestamp: new Date().toLocaleTimeString(),
                    },
                  ]);
                }
              }
            }

            await deleteNotification(
              credentials.idInstance,
              credentials.apiTokenInstance,
              receiptId,
            );
          }
        } catch (err) {
          console.error("Ошибка в polling цикле:", err);
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    };

    poll();

    return () => {
      isCancelled = true;
      isPollingRef.current = false;
    };
  }, [credentials, chatId]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white p-4 border-b shadow-sm">
        <h3 className="font-bold text-gray-800">Чат с {chatId}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">
            Нет сообщений. Напишите первым!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow ${
                  msg.sender === "me"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs opacity-70 block text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 border-t flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Введите сообщение..."
          className="flex-1 p-2 border rounded focus:outline-none focus:border-green-500"
        />
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

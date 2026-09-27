import { useState } from "react";

const AuthForm = ({ onLogin }) => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idInstance && apiTokenInstance) {
      onLogin({
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Вход в GREEN-API (Telegram)
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            idInstance
          </label>
          <input
            type="text"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Например: 410022747706"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            apiTokenInstance
          </label>
          <input
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Введите apiTokenInstance"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default AuthForm;

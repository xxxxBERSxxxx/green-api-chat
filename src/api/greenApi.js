import axios from "axios";

const API_URL = "https://4100.api.green-api.com";

const api = axios.create({
  baseURL: API_URL,
});

export const sendMessage = async (
  idInstance,
  apiTokenInstance,
  chatId,
  message,
) => {
  try {
    const response = await api.post(
      `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
      { chatId, message },
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка отправки:", error.response?.data || error.message);
    throw error;
  }
};

export const receiveNotification = async (idInstance, apiTokenInstance) => {
  try {
    const response = await api.get(
      `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
      {
        timeout: 30000,
      },
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 408) {
      return null;
    }

    if (error.response?.status === 400) {
      return null;
    }
    console.error("Ошибка получения:", error.response?.data || error.message);
    return null;
  }
};

export const deleteNotification = async (
  idInstance,
  apiTokenInstance,
  receiptId,
) => {
  try {
    await api.delete(
      `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    );
  } catch (error) {
    console.error("Ошибка удаления:", error.response?.data || error.message);
  }
};

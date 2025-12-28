import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../api/chat.api";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useToast } from "../common/Toast";
import Loader from "../common/Loader";

const ChatWindow = ({ appointmentId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const { show: showToast } = useToast();

  // Fetch appointment details to verify access and status
  useEffect(() => {
    let statusInterval = null;

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/appointment/${appointmentId}`);
        const apptData = res.data;
        setAppointment(apptData);

        // If appointment accepted, fetch messages immediately
        if (apptData.status === "accepted") {
          setError(null);
          fetchMessages();
        } else {
          // If not accepted yet, show waiting message and poll for status
          setError("Waiting for doctor to accept the appointment...");
          // Start polling for status
          if (!statusInterval) {
            statusInterval = setInterval(async () => {
              try {
                const r = await api.get(`/appointment/${appointmentId}`);
                const updated = r.data;
                setAppointment(updated);
                if (updated.status === "accepted") {
                  clearInterval(statusInterval);
                  setError(null);
                  fetchMessages();
                }
              } catch (pollErr) {
                console.error("Polling appointment status failed:", pollErr);
              }
            }, 3000);
          }
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load appointment. You may not have access."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();

    const onAccepted = (e) => {
      try {
        const detail = e.detail || {};
        if (detail.appointmentId === appointmentId) {
          // Immediately refresh appointment and messages
          fetchMessages();
          setAppointment((prev) => ({ ...(prev || {}), status: "accepted" }));
          setError(null);
        }
      } catch (err) {}
    };

    window.addEventListener("appointment-accepted", onAccepted);

    return () => {
      if (statusInterval) clearInterval(statusInterval);
      window.removeEventListener("appointment-accepted", onAccepted);
    };
  }, [appointmentId]);

  const fetchMessages = async () => {
    try {
      const res = await getMessages(appointmentId);
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
      // Silently fail on fetch - try again next poll
    }
  };

  // Poll for new messages
  useEffect(() => {
    if (!appointment || appointment.status !== "accepted") return;

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [appointmentId, appointment]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const messageText = text.trim();
    setText("");

    try {
      await sendMessage(appointmentId, messageText);
      fetchMessages();
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to send message",
        "error"
      );
      setText(messageText); // Restore text if failed
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-8 text-gray-500">
        Appointment not found
      </div>
    );
  }

  const otherPerson =
    user.role === "doctor"
      ? appointment.patientId.name
      : appointment.doctorId.name;

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <h3 className="font-semibold">Chat with {otherPerson}</h3>
        <p className="text-sm text-blue-100">Appointment ID: {appointmentId}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMe={msg.senderId._id === user.id}
              senderName={msg.senderId.name}
            />
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t bg-white p-4 flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={appointment?.status === "accepted" ? "Type your message..." : "Waiting for appointment to be accepted..."}
          className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={appointment?.status !== "accepted"}
        />
        <button
          type="submit"
          disabled={appointment?.status !== "accepted" || !text.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

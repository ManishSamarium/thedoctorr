import { useParams } from "react-router-dom";
import ChatWindow from "../../components/chat/ChatWindow";

const ChatPage = () => {
  const { appointmentId } = useParams();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Consultation Chat
      </h2>
      <ChatWindow appointmentId={appointmentId} />
    </div>
  );
};

export default ChatPage;

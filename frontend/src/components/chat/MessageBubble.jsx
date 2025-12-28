const MessageBubble = ({ message, isMe }) => {
  return (
    <div
      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
        isMe
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-200 text-black mr-auto"
      }`}
    >
      {message.text}
    </div>
  );
};

export default MessageBubble;

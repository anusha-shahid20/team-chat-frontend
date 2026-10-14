export default function MessageList({ messages }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <ul className="space-y-2">
          {messages.map((msg) => (
            <li key={msg.id} className="p-3 bg-gray-100 rounded">
              <strong>{msg.sender}:</strong> {msg.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
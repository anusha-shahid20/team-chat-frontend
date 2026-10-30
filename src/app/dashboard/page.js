"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const [notification, setNotification] = useState("");
  
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");
    
    if (!token) {
      router.push("/login");
      return;
    }
    
    setUsername(user || "User");
    setRole(userRole || "employee");

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return; 
    }

    const ws = new WebSocket("wss://anushakhalil.pythonanywhere.com/ws/chat/general/");
    wsRef.current = ws;

    ws.onopen = () => {
      setSocketStatus("Connected");
      ws.send(JSON.stringify({ sender: user || "User" }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "ping") return; 

      if (data.type === "system") {
        setMessages((prev) => [...prev, { type: "system", text: data.message }]);
      } else if (data.type === "chat") {
        setMessages((prev) => [...prev, { type: "chat", text: data.message, sender: data.sender }]);
        
        if (data.sender !== username) {
          setNotification(`New message from ${data.sender}`);
          setTimeout(() => setNotification(""), 3000);
        }
      } else if (data.type === "presence") {
        setMessages((prev) => [...prev, { type: "system", text: data.message }]);
      }
    };

    ws.onclose = () => setSocketStatus("Disconnected");
    ws.onerror = () => setSocketStatus("Error");

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [router, username]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    router.push("/login");
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return; 
    }

    wsRef.current.send(JSON.stringify({ 
      message: newMessage,
      sender: username 
    }));
    
    setNewMessage("");
  }

  return (
    <main className="h-screen bg-gray-50 flex flex-col overflow-hidden relative">
      
      {notification && (
        <div className="absolute top-20 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-bounce z-50">
          🔔 {notification}
        </div>
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-xl">💬</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Team Chat</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-gray-600 text-sm">
              Hi, <strong>{username}</strong>
            </span>
            {role === 'admin' ? (
              <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md mt-1">
                👑 HR / Admin
              </span>
            ) : (
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-md mt-1">
                👤 Employee
              </span>
            )}
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto flex-shrink-0 hidden md:block">
            <h2 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Menu</h2>
            <ul className="space-y-1">
              <li>
                <Link href="/dashboard" className="block px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium cursor-pointer">
                  💬 Live Chat
                </Link>
              </li>
              <li>
                <Link href="/notes" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                  📝 Notes
                </Link>
              </li>
              
              {role === 'admin' && (
                <>
                  <li>
                    <Link href="/resume" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                      🤖 Resume AI
                    </Link>
                  </li>
                  <li>
                    <Link href="/rank" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                      🏆 Leaderboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-jobs" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                      📋 My Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="/jobs" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                      💼 Post a Job
                    </Link>
                  </li>
                  <li>
                    <Link href="/add-employee" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                      👥 Add Employee
                    </Link>
                  </li>
                </>
              )}
              
              {/* Settings is visible to everyone */}
              <li>
                <Link href="/settings" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                  ⚙️ Settings
                </Link>
              </li>
            </ul>
          </aside>
        )}

        <div className="flex-1 flex flex-col bg-white">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div>
              <h1 className="text-xl font-bold text-gray-900"># general</h1>
              <p className="text-sm text-gray-500">Real-time team chat</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${socketStatus === "Connected" ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="text-sm text-gray-600">{socketStatus}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => {
              if (msg.type === "system") {
                return (
                  <div key={index} className="text-center text-sm text-gray-500 italic">
                    {msg.text}
                  </div>
                );
              }
              return (
                <div key={index} className="flex flex-col">
                  <span className="text-sm font-semibold text-blue-600 mb-1">{msg.sender}</span>
                  <div className="bg-gray-100 rounded-lg p-3 w-fit max-w-[80%] text-gray-800">
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                type="submit"
                disabled={socketStatus !== "Connected"}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import './ChatSection.css';

const ChatSection = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI stylist. Upload your photo and I'll help you discover your perfect style!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Based on your features, I recommend warm-toned makeup that complements your skin's natural glow.",
        "For your face shape, a side-swept hairstyle would create beautiful balance and dimension.",
        "I suggest trying earthy tones in your clothing - they'll really make your features pop!",
        "Your skin tone would look amazing with gold jewelry and warm, berry-toned lip colors.",
        "Consider trying a center partition with soft waves to frame your face beautifully."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: messages.length + 2,
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section id="chat" className="section chat-section">
      <div className="container">
        <h2 className="section-heading">Chat with Your AI Stylist</h2>
        <p className="section-subheading">Get personalized style advice and recommendations in real-time</p>
        
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-bot-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="chat-bot-info">
              <h3>AI Stylist</h3>
              <span className="status online">Online</span>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="quick-questions">
            <p>Quick questions:</p>
            <div className="question-buttons">
              {[
                "What makeup suits my skin tone?",
                "Best hairstyle for my face shape?",
                "Color clothing recommendations?",
                "How to do my eyebrows?"
              ].map((question, index) => (
                <button
                  key={index}
                  className="question-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <div className="input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about makeup, hair, fashion..."
                className="chat-input"
              />
              <button type="submit" className="send-btn">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
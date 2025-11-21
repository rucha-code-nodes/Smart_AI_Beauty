import React, { useState, useRef, useEffect } from 'react';
import './ChatSection.css';

const ChatSection = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm your AI Stylist. I can help you with makeup, hairstyle, and fashion recommendations. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your features, I'd recommend warm-toned makeup with golden highlights to enhance your natural glow.",
        "For your face shape, a layered haircut with side-swept bangs would create beautiful framing and balance.",
        "Try pairing earthy tones with metallic accessories for a sophisticated yet modern look.",
        "Your skin undertone works perfectly with coral and peach shades - they'll make your complexion radiant!",
        "Consider a deep side part with soft waves for your next event - it'll accentuate your facial structure beautifully."
      ];
      
      const botMessage = {
        type: 'bot',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const quickQuestions = [
    "What makeup suits my skin tone?",
    "Best hairstyle for my face shape?",
    "What colors should I wear?",
    "Office makeup recommendations?",
    "Evening look suggestions?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <section id="chat" className="section">
      <div className="container">
        <h2 className="section-heading">Chat with Your AI Stylist</h2>
        <p className="section-subheading">Get instant personalized advice for makeup, hair, and fashion</p>
        
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-title">
              <i className="fas fa-robot"></i>
              <span>AI Stylist Assistant</span>
            </div>
            <div className="chat-status">
              <div className="status-indicator"></div>
              <span>Online</span>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot">
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
              {quickQuestions.map((question, index) => (
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
                placeholder="Ask about makeup, hair, or fashion..."
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
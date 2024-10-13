import React, { useState, useEffect } from 'react';
import aiService from '../services/aiService';
import LoanRecommendations from './LoanRecommendations';


function ChatInterface({ selectedClient, updateClientInfo }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState('initial');

  useEffect(() => {
    if (selectedClient && messages.length === 0) {
      startNewConversation();
    }
  }, [selectedClient]);

  const startNewConversation = async () => {
    setIsLoading(true);
    try {
      const initialPrompt = `You are a helpful AI assistant for a finance broker. Your task is to gather information about the client in a conversational manner. Start by greeting the client and asking for their name. Then, proceed to ask about their occupation, annual income, assets, and loan purpose. Be polite and professional at all times.`;
      const aiResponse = await aiService.getAIResponse([
        { role: 'system', content: initialPrompt },
      ]);
      setMessages([{ role: 'assistant', content: aiResponse }]);
      setCurrentStage('name');
    } catch (error) {
      console.error('Error starting conversation:', error);
      setMessages([
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const processAIResponse = async (response) => {
    const stages = ['name', 'occupation', 'income', 'assets', 'loan_purpose', 'completed'];
    const currentIndex = stages.indexOf(currentStage);
    
    // Extract client information from AI response
    const extractInfo = (regex, key) => {
      const match = response.match(regex);
      if (match) updateClientInfo({ [key]: match[1] });
    };
  
    extractInfo(/Client's name: (.+)/, 'name');
    extractInfo(/Occupation: (.+)/, 'job');
    extractInfo(/Annual income: (.+)/, 'income');
    extractInfo(/Assets: (.+)/, 'assets');
    extractInfo(/Loan purpose: (.+)/, 'loan_purpose');
  
    // Determine next stage
    if (currentIndex < stages.length - 1 && response.toLowerCase().includes(stages[currentIndex + 1])) {
      setCurrentStage(stages[currentIndex + 1]);
    } else if (response.toLowerCase().includes('thank you for providing all the information')) {
      setCurrentStage('completed');
    }
  
    console.log('AI Response:', response);
    console.log('Current Stage:', currentStage);
  };
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
  
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      const systemPrompt = `You are a finance broker assistant. The current stage of the conversation is: ${currentStage}. Ask for the next piece of information based on this stage. If all information has been gathered, summarize the client's details and suggest next steps.`;
      
      const aiResponse = await aiService.getAIResponse([
        { role: 'system', content: systemPrompt },
        ...messages,
        userMessage,
      ]);
  
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: aiResponse }]);
      await processAIResponse(aiResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response ? error.response.data : error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.',
        },
      ]);
    }
  
    setIsLoading(false);
  };
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div
              className={`${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300'
              } px-4 py-2 rounded-lg`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-300 px-4 py-2 rounded-lg">Thinking...</div>
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            disabled={isLoading}
          >
            Send
          </button>

          <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <LoanRecommendations clientInfo={selectedClient} />
      </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
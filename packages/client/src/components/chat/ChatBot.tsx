import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

//Create the 2 audio objects.
const popAudio = new Audio(popSound);
popAudio.volume = 0.5;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.5;

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState(''); //error handling.

   const conversationId = useRef(crypto.randomUUID()); //to create the unique Id for the conversation, it should be created once and should not change, this is why you don´t use the state hook.

   //Submit the form and clear it, and call the backend (axios).
   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]); //to get the latest version of the mesages array. prev = previous.
         setIsBotTyping(true);
         setError(''); //to reset the error when it is solved.
         popAudio.play();

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            //data is an object we get from the server.
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (error) {
         console.log(error);
         setError('Something went wrong, try again!');
      } finally {
         //get the latest version of the mesages array, data is an object with a message property.
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-pink-600">{error}</p>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;

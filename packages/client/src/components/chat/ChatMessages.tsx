import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

//to style the messages, depending on who writes them.
export type Message = {
   content: string;
   role: 'user' | 'bot';
};

//Give the component the list of messages.
type Props = {
   messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null); //to start an auto scrolling when the screen is full.

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopyMessage = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="flex flex-col gap-3">
         {messages.map((message, index) => (
            <div
               key={index}
               //copy a selected text.
               onCopy={onCopyMessage}
               //for autoscrolling.
               ref={index === messages.length - 1 ? lastMessageRef : null}
               className={`px-3 py-1 rounded-xl ${
                  message.role === 'user'
                     ? 'bg-purple-300 text-purple-800 self-end'
                     : 'bg-gray-300 text-purple-900 self-start'
               }`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessages;

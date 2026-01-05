import axios from 'axios';
import { useRef, useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { BsSendArrowUp } from 'react-icons/bs';
import { Button } from '../ui/button';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';

//Handle form submissions.
type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState(''); //error handling.

   const conversationId = useRef(crypto.randomUUID()); //to create the unique Id for the conversation, it should be created once and should not change, this is why you don´t use the state hook.
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   //Submit the form and clear it, and call the backend (axios).
   const onSubmit = async ({ prompt }: FormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]); //to get the latest version of the mesages array. prev = previous.
         setIsBotTyping(true);
         setError(''); //to reset the error when it is solved.

         reset({ prompt: '' }); //to be able to send the same question as many times as you want.

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            //data is an object we get from the server.
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch (error) {
         console.log(error);
         setError('Something went wrong, try again!');
      } finally {
         //get the latest version of the mesages array, data is an object with a message property.
         setIsBotTyping(false);
      }
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)(); //call the function.
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-pink-600">{error}</p>}
         </div>
         <form
            onSubmit={(e) => handleSubmit(onSubmit)(e)} //Pass a function reference. This ensures handleSubmit is only "triggered" when the actual submit event occurs, not during the render process.
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               //... to spread the object and add all its props to the text area.
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               autoFocus
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything you want!"
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <BsSendArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;

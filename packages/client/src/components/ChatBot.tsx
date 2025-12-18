import axios from 'axios';
import { useRef, useState, type KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { useForm } from 'react-hook-form';
import { BsSendArrowUp } from 'react-icons/bs';
import { Button } from './ui/button';

//Handle form submissions.
type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

//to style the messages, depending on who writes them.
type Message = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const conversationId = useRef(crypto.randomUUID()); //to create the unique Id for the conversation, it should be created once and should not change, this is why you don´t use the state hook.
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   //Submit the form and clear it, and call the backend (axios).
   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]); //to get the latest version of the mesages array. prev = previous.

      reset();

      const { data } = await axios.post<ChatResponse>('/api/chat', {
         //data is an object we get from the server.
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]); //get the latest version of the mesages array, data is an object with a message property.
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)(); //call the function.
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-blue-400 text-amber-100 self-end'
                        : 'bg-gray-400 text-yellow-200 self-start'
                  }`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </p>
            ))}
         </div>
         <form
            onSubmit={(e) => handleSubmit(onSubmit)(e)} //Pass a function reference. This ensures handleSubmit is only "triggered" when the actual submit event occurs, not during the render process.
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })} //... to spread the object and add all its props to the text area.
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

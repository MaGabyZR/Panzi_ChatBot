import axios from 'axios';
import { useRef, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { BsSendArrowUp } from 'react-icons/bs';
import { Button } from './ui/button';

//Handle form submissions.
type FormData = {
   prompt: string;
};

const ChatBot = () => {
   const conversationId = useRef(crypto.randomUUID()); //to create the unique Id for the conversation, it should be created once and should not change, this is why you don´t use the state hook.
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   //Submit the form and clear it, and call the backend (axios).
   const onSubmit = async ({ prompt }: FormData) => {
      reset();

      const { data } = await axios.post('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      console.log(data);
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)(); //call the function.
      }
   };

   return (
      <form
         onSubmit={(e) => handleSubmit(onSubmit)(e)} //Pass a function reference.
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
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <BsSendArrowUp />
         </Button>
      </form>
   );
};

export default ChatBot;

import type { KeyboardEvent } from 'react';
import { BsSendArrowUp } from 'react-icons/bs';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

//Handle form submissions.
export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();
   //Pass a function reference. This ensures handleSubmit is only "triggered" when the actual submit event occurs, not during the render process.
   const submit = handleSubmit((data) => {
      reset({ prompt: '' }); //to be able to send the same question as many times as you want.
      onSubmit(data);
   });

   const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submit(); //call the function.
      }
   };

   return (
      <form
         onSubmit={submit}
         onKeyDown={handleKeyDown}
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
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <BsSendArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;

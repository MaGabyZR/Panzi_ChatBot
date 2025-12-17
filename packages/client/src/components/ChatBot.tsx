import { useForm } from 'react-hook-form';
import { BsSendArrowUp } from 'react-icons/bs';
import { Button } from './ui/button';

//Handle form submissions.
type FormData = {
   prompt: string;
};

const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   //Submit the form and clear it.
   const onSubmit = (data: FormData) => {
      console.log(data);
      reset();
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)(); //Call the function.
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)} //Pass a funciton reference.
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

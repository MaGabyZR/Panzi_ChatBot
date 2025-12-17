import { Button } from './ui/button';
import { BsSendArrowUp } from 'react-icons/bs';

const ChatBot = () => {
   return (
      <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
         <textarea
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything you want!"
            maxLength={1000}
         />
         <Button className="rounded-full w-9 h-9">
            <BsSendArrowUp />
         </Button>
      </div>
   );
};

export default ChatBot;

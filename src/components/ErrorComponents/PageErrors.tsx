import { RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import type { PageErrorProps } from "@/types";

const PageErrors = ({ err, onRetry }: PageErrorProps) => {
  return (
    <div className="bg-background text-white flex justify-center items-center">
      <div className="max-w-4xl mx-auto px-4 py-6 gap-10 flex flex-col justify-center items-center">
        <img src="/assets/server.png" alt="" className=" w-2/5 h-2/5" />
        <p className="text-lg font-bold text-destructive">
          Error loading this page: {err}
        </p>
        <Button
          onClick={onRetry}
          className="bg-muted hover:bg-secondary text-white rounded-full cursor-pointer"
        >
          <RotateCcw />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default PageErrors;

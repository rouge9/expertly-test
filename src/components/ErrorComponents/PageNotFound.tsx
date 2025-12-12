import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background text-white flex justify-center items-center">
      <div className="max-w-4xl mx-auto px-4 py-6 gap-10 flex flex-col items-center">
        <img src="/assets/error-404.png" alt="" className="h-1/2 w-1/2" />
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button
          variant={"outline"}
          className=""
          onClick={() => {
            navigate(-1);
          }}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

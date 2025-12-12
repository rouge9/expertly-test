const PageErrors = ({ err }: { err: string | null }) => {
  return (
    <div className="bg-background text-white flex justify-center items-center">
      <div className="max-w-4xl mx-auto px-4 py-6 gap-10 flex flex-col justify-center items-center">
        <img src="/assets/server.png" alt="" className="" />
        <p className="text-lg font-bold text-destructive">
          Error loading this page {err}
        </p>
      </div>
    </div>
  );
};

export default PageErrors;

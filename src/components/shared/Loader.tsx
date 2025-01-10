import HashLoader from "react-spinners/HashLoader";

const Loader = ({ text }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center  ">
      <HashLoader
        color={"#000"}
        size={50}
        speedMultiplier={0.8}
        data-testid="loader"
        data-cy="loader"
      />
      <p className="text-lg text-gray-500 dark:text-gray-300">{text}</p>
    </div>
  );
};

export default Loader;

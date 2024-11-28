import MyButton from "./MyButton";

export default function MyDialog({
  open,
  children,
  title,
  contentText,
  handleContinue,
}) {
  if (open) {
    return (
      <div className="absolute w-full h-full top-0 left-0 z-10 bg-black/20 flex justify-center items-center">
        <div className="rounded-md bg-white w-auto flex flex-col py-6 px-12">
          <h1 className="uppercase font-bold font-mono">{title}</h1>
          <div className="flex flex-col my-10">
            <span className="font-mono text-gray-500">{contentText}</span>
            {children} {/* Other content */}
          </div>
          <MyButton handleClick={handleContinue} label="Continue" />
        </div>
      </div>
    );
  }

  return <></>;
}

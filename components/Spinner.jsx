import { BounceLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-full mx-auto">
      <BounceLoader color={'#1E3A8A'} speedMultiplier={2} />
    </div>
  );
}
import PriceFormatter from "./PriceFormatter";

interface Props{
    price: number | undefined;
    discount: number | undefined;
    className?: string;
}
const PriceView = ({price,discount,className}:Props) => {

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <PriceFormatter amount={price} className="text-kitenge-red" />
      {price && discount && discount !== 0 && (
        <PriceFormatter
          amount={price + (discount * price) / 100}
          className="line-through text-xs font-normal text-gray-400"
        />
      )}
    </div>
  );
}

export default PriceView

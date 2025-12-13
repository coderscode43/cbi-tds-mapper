import { Icons } from "@/lib/Icons";

const UniversalAssets = ({
  asset,
  size = 22,
  stroke = 2,
  className,
  alt = "",
  iconHandler,
  imgHandler,
}) => {
  const isIcon = Object.prototype.hasOwnProperty.call(Icons, asset);

  if (isIcon) {
    const IconComponent = Icons[asset];
    return (
      <IconComponent
        size={size}
        stroke={stroke}
        className={className}
        onClick={iconHandler}
      />
    );
  }

  return (
    <img src={asset} alt={alt} className={className} onClick={imgHandler} />
  );
};

export default UniversalAssets;

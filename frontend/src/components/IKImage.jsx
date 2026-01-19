import { Image } from "@imagekit/react";

function IKImage({ src, className, alt, w, h }) {
  return (
    <Image
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      src={src}
      className={className}
      alt={alt}
      loading="lazy"
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
          lqip: true,
        },
      ]}
    />
  );
}

export default IKImage;

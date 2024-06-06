import { Image } from "../entities";

const ProductImageGallery = ({ images }: { images: Image[] }) => {
  if (images.length === 0) return null;

  return (
    <ul>
      {images.map((image) => (
        <li key={image.url}>
          <img
            src={image.url}
            alt={image.alt}
            width={image.width || "100%"}
            height={image.height || 85}
          />
        </li>
      ))}
    </ul>
  );
};

export default ProductImageGallery;

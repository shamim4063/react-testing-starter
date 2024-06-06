import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";
import { Image } from "../../src/entities";

describe("ProductImageGellary", () => {
  it("Should return null when there have no image", () => {
    const { container } = render(<ProductImageGallery images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render images when there have images", () => {
    const images: Array<Image> = [
      {
        url: "https://dummyjson.com/image/150",
        alt: "It is a 150x150 size dummy image",
        width: '250',
        height:'150'
      },
      {
        url: "https://dummyjson.com/image/200x100",
        alt: "It is a 200x100 size dummy image",
      },
      {
        url: "https://dummyjson.com/image/400x200/008080/ffffff?text=Hello+Peter",
        alt: "It is a 400x200 size placeholder image",
      },
    ];

    render(<ProductImageGallery images={images} />);

    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(3);

    images.forEach((image, index) => {
      expect(imgs[index]).toHaveAttribute("src", image.url);
      expect(imgs[index]).toHaveAttribute("alt", image.alt);
      expect(imgs[index]).toHaveAttribute('width', image.width || '100%');
      expect(imgs[index]).toHaveAttribute('height', image.height || '85');
    });
  });
});

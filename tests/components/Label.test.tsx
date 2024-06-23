import { render, screen } from "@testing-library/react";

import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
    
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe('Given the current language is EN', ()=>{
    it.each([
        {
          labelId: "welcome",
          labelText: "Welcome",
        },
        {
          labelId: "new_product",
          labelText: "New Product",
        },
        {
          labelId: "edit_product",
          labelText: "Edit Product",
        },
      ])("should render correct text for $labelId", ({ labelId, labelText }) => {
        renderComponent(labelId, "en");
        expect(screen.getByText(labelText)).toBeInTheDocument();
      });
  })

  describe('Given the current language is ES', ()=>{
    it.each([
        {
          labelId: "welcome",
          labelText: "Bienvenidos",
        },
        {
          labelId: "new_product",
          labelText: "Nuevo Producto",
        },
        {
          labelId: "edit_product",
          labelText: "Editar Producto",
        },
      ])("should render correct text for $labelId", ({ labelId, labelText }) => {
        renderComponent(labelId, "es");
        expect(screen.getByText(labelText)).toBeInTheDocument();
      });
  })

  it('should throw an error while labelId is not present', ()=>{
    expect(()=> renderComponent('!', "en")).toThrowError();
  })


});

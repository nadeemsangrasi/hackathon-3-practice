export const product = {
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    {
      name: "id",
      type: "string",
      title: "Product ID",
      description: "Unique identifier for the product",
    },
    {
      name: "name",
      type: "string",
      title: "Product Name",
    },
    {
      name: "description",
      type: "string",
      title: "Description",
    },
    {
      name: "price",
      type: "number",
      title: "Product Price",
    },
    {
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Add relevant tags like 'electronics', 'peripherals', etc.",
    },
    {
      name: "sizes",
      type: "array",
      title: "Sizes",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Add sizes like S , M , L , XL , XXL",
    },
    {
      name: "image",
      type: "image",
      title: "Product Image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "rating",
      type: "number",
      title: "Product Rating",
      description: "Average rating of the product (e.g., 4.5)",
    },
    {
      name: "stock_quantity",
      type: "number",
      title: "Stock Quantity",
      description: "Number of items available in stock",
    },
  ],
};

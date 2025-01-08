import { type SchemaTypeDefinition } from "sanity";
import productSchema from "@/sanity/schema";
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema],
};

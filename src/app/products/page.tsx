import Product from "@/components/shared/Product";
import { client } from "@/sanity/lib/client";

export default async function Home() {
  const query = await client.fetch(
    `*[_type == "product"]{
        _id,
      name,
      price,
      "image": image.asset->url
    }`
  );

  return (
    <div className="px-8">
      <h1 className="text-6xl my-16 font-semibold text-center">Products</h1>
      <div className="flex justify-between  flex-wrap">
        {query.map(
          ({
            image,
            name,
            price,
          }: {
            name: string;
            price: number;
            image: string;
          }) => (
            <Product key={name} image={image} price={price} name={name} />
          )
        )}
      </div>
    </div>
  );
}

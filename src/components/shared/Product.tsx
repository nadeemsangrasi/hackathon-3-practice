import React from "react";
import Link from "next/link";

import Image from "next/image";

const Product = ({
 
  name,
  price,

  image,
}: {

  name: string;
  price: number;

  image: string;
}) => {
  return (
    <div className="bg-primary-gray mx-auto flex flex-col justify-between card rounded-xl text-center md:text-start  hover:shadow-2xl transition-all ease  duration-500 hover:-translate-y-5 w-[300px] h-fit  md:w-[340px] ">
      <div className="overflow-hidden ">
        <div>
          <Image
            width={400}
            height={320}
            src={image}
            alt="image"
            className="object-cover rounded-lg "
          />
        </div>
        <h2 className="text-2xl font-bold px-5 break-words py-2">
          <Link href={name}>{name}</Link>
        </h2>
        <h2 className="text-lg bg-primary-white text-black w-fit font-bold mx-5 px-2  break-words ">
          ${price}
        </h2>
        <div className="space-x-4 px-5 my-4"></div>
      </div>
    </div>
  );
};

export default Product;

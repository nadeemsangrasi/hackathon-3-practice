import Link from "next/link";
import React from "react";

type ShipmentData = {
  label_id: string;
  status: string;
  ship_date: string;
  shipment_cost: {
    currency: string;
    amount: number;
  };
  tracking_number: string;
  tracking_status: string;
  tracking_url: string;
  ship_to: {
    name: string;
    phone: string;
    address_line1: string;
    city_locality: string;
    state_province: string;
    postal_code: string;
    country_code: string;
  };
  label_download: {
    pdf: string;
    href: string;
    png: string;
    zpl: string;
  };
};

type ShipmentCardProps = {
  data: ShipmentData;
};

const LabelCard: React.FC<ShipmentCardProps> = ({ data }) => {
  const {
    label_id,
    status,
    ship_date,
    shipment_cost,
    tracking_number,
    tracking_status,
    ship_to,
    label_download,
  } = data;
  const href = label_download.href.split("/");
  href.splice(0, 3);

  return (
    <div className="border rounded-lg shadow-md p-6 bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">Shipment ID: {label_id}</h2>
      <p className="text-gray-600 mb-2">
        Status: <span className="font-medium text-blue-600">{status}</span>
      </p>
      <p className="text-gray-600 mb-2">
        Ship Date: {new Date(ship_date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        Cost: {shipment_cost.currency.toUpperCase()}{" "}
        {shipment_cost.amount.toFixed(2)}
      </p>
      <p className="text-gray-600 mb-2">
        Tracking Number: <span className="font-medium">{tracking_number}</span>
      </p>
      <p className="text-gray-600 mb-4">Tracking Status: {tracking_status}</p>
      <h3 className="text-lg font-semibold mb-2">Ship To:</h3>
      <p className="text-gray-600">{ship_to.name}</p>
      <p className="text-gray-600">{ship_to.phone}</p>
      <p className="text-gray-600">
        {ship_to.address_line1}, {ship_to.city_locality},{" "}
        {ship_to.state_province} {ship_to.postal_code}
      </p>
      <p className="text-gray-600">{ship_to.country_code}</p>
      <div className="mt-4 flex gap-2">
        <Link
          href={`https://api.shipengine.com/${href.join("/")}`}
          target="_blank"
          className="bg-green-600 text-white px-4 py-2 rounded-md
          hover:bg-green-700 transition"
        >
          Download Label
        </Link>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
          <Link href={"/tracking/" + label_id}>Track Order</Link>
        </button>
      </div>
    </div>
  );
};

export default LabelCard;

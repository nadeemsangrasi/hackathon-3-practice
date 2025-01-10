import React from "react";
import { Button } from "../ui/button";

interface Amount {
  currency: string;
  amount: number;
}

export interface ShipmentCardProps {
  rate_id: string;
  service_type: string;
  shipping_amount: Amount;
  estimated_delivery_date: string;
  generateShipmentLabel: (rateId: string) => void;
  delivery_days: number;
  warning_messages: string[];
}

const ShipmentRatesCard: React.FC<ShipmentCardProps> = ({
  rate_id,
  service_type,
  shipping_amount,
  estimated_delivery_date,
  generateShipmentLabel,
  delivery_days,
  warning_messages,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Shipment Details</h2>
      <div className="mt-4">
        <p>
          <strong>Rate ID:</strong> {rate_id}
        </p>
        <p>
          <strong>Service Type:</strong> {service_type}
        </p>
        <p>
          <strong>Shipping Amount:</strong>{" "}
          {shipping_amount?.currency.toUpperCase()} {shipping_amount?.amount}
        </p>
        <p>
          <strong>Estimated Delivery Date:</strong>{" "}
          {new Date(estimated_delivery_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Delivery Days:</strong> {delivery_days} days
        </p>
        <div className="pt-4">
          <Button
            variant={"default"}
            onClick={() => generateShipmentLabel(rate_id)}
          >
            Select Rate
          </Button>
        </div>
        {warning_messages.length > 0 && (
          <div className="mt-4 bg-yellow-100 text-yellow-800 p-4 rounded-lg hover:-translate-y-4">
            <strong>Warnings:</strong>
            <ul className="list-disc ml-6">
              {warning_messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentRatesCard;

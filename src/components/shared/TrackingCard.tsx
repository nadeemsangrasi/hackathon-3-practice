import Link from "next/link";
import React from "react";
import { FaTruck, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

interface TrackingCardProps {
  tracking_number: string;
  tracking_url: string;
  status_code: string;
  status_description: string;
  carrier_code: string;
  carrier_status_description: string;
  shipDate: string | null;
  estimated_delivery_date: string | null;
  actual_delivery_date: string | null;
  exception_description: string | null;
}

const TrackingCard: React.FC<{ data: TrackingCardProps }> = ({ data }) => {
  const {
    tracking_number,
    tracking_url,
    status_code,
    status_description,
    carrier_code,
    carrier_status_description,
    shipDate,
    estimated_delivery_date,
    actual_delivery_date,
    exception_description,
  } = data;

  const statusIcon =
    status_code === "DL" ? (
      <FaCheckCircle className="text-green-500" />
    ) : status_code === "EX" ? (
      <FaExclamationCircle className="text-red-500" />
    ) : (
      <FaTruck className="text-gray-500" />
    );

  return (
    <div className="max-w-md bg-white shadow-lg rounded-lg p-6 border border-gray-200 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Tracking Details
        </h3>
        <div className="text-2xl">{statusIcon}</div>
      </div>
      <div className="space-y-4">
        <div>
          <span className="block text-sm font-medium text-gray-500">
            Tracking Number:
          </span>
          <Link
            href={tracking_url || ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-words"
          >
            {tracking_number}
          </Link>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-500">
            Status:
          </span>
          <span
            className={`block text-sm font-medium ${
              status_code === "DL"
                ? "text-green-600"
                : status_code === "EX"
                  ? "text-red-600"
                  : "text-gray-800"
            }`}
          >
            {status_description || "Not Available"}
          </span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-500">
            Carrier:
          </span>
          <span className="block text-sm text-gray-800">
            {carrier_code?.toUpperCase()}
          </span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-500">
            Carrier Status:
          </span>
          <span className="block text-sm text-gray-800">
            {carrier_status_description || "Not Available"}
          </span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-500">
            Ship Date:
          </span>
          <span className="block text-sm text-gray-800">
            {shipDate || "Not Available"}
          </span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-500">
            Estimated Delivery:
          </span>
          <span className="block text-sm text-gray-800">
            {estimated_delivery_date || "Not Available"}
          </span>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-500">
            Actual Delivery:
          </span>
          <span className="block text-sm text-gray-800">
            {actual_delivery_date || "Not Available"}
          </span>
        </div>
        {exception_description && (
          <div>
            <span className="block text-sm font-medium text-red-600">
              Exception:
            </span>
            <span className="block text-sm text-red-600">
              {exception_description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingCard;

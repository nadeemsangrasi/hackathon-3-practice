"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ShipmentRatesCard, { ShipmentCardProps } from "./ShipmentRatesCard";
import LabelCard from "./LabelCard";
import Loader from "./Loader";

const formSchema = z.object({
  rate_options: z.object({
    carrier_ids: z.array(z.string()).nonempty(),
  }),
  shipment: z.object({
    validate_address: z.enum(["no_validation"]),
    ship_to: z.object({
      name: z.string().min(1),
      phone: z.string().min(1),
      company_name: z.string().optional(),
      address_line1: z.string().min(1),
      city_locality: z.string().min(1),
      state_province: z.string().min(1),
      postal_code: z.string().min(1),
      country_code: z.string().length(2),
      address_residential_indicator: z.enum(["yes", "no"]),
    }),
    ship_from: z.object({
      name: z.string().min(1),
      phone: z.string().min(1),
      company_name: z.string().optional(),
      address_line1: z.string().min(1),
      city_locality: z.string().min(1),
      state_province: z.string().min(1),
      postal_code: z.string().min(1),
      country_code: z.string().length(2),
      address_residential_indicator: z.enum(["yes", "no"]),
    }),
    packages: z
      .array(
        z.object({
          package_code: z.string().min(1),
          weight: z.object({
            value: z.number().positive(),
            unit: z.enum(["ounce", "pound", "gram", "kilogram"]),
          }),
        })
      )
      .nonempty(),
  }),
});

export default function ShipmentForm() {
  const [shipmentRates, setShipmentRates] = useState([]);
  const [showShipFrom, setShowShipFrom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shipmentLabels, setShipmentLabels] = useState(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rate_options: {
        carrier_ids: ["se-1576791"],
      },
      shipment: {
        validate_address: "no_validation",
        ship_to: {
          name: "",
          phone: "",
          company_name: "",
          address_line1: "",
          city_locality: "",
          state_province: "",
          postal_code: "",
          country_code: "US",
          address_residential_indicator: "no",
        },
        ship_from: {
          name: "ShipEngine Team",
          phone: "222-333-4444",
          company_name: "ShipEngine",
          address_line1: "4301 Bull Creek Road",
          city_locality: "Austin",
          state_province: "TX",
          postal_code: "78731",
          country_code: "US",
          address_residential_indicator: "no",
        },
        packages: [
          {
            package_code: "package",
            weight: {
              value: 6,
              unit: "ounce",
            },
          },
        ],
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `/api/shipengine/rates`,
        {
          rate_options: {
            carrier_ids: [process.env.NEXT_PUBLIC_SHIPENGINE_FIRST_COURIER!],
          },
          shipment: {
            validate_address: "no_validation",
            ship_to: {
              name: values.shipment.ship_to.name,
              phone: values.shipment.ship_to.phone,
              company_name: values.shipment.ship_to.company_name || "",
              address_line1: values.shipment.ship_to.address_line1,
              city_locality: values.shipment.ship_to.city_locality,
              state_province: values.shipment.ship_to.state_province,
              postal_code: values.shipment.ship_to.postal_code,
              country_code: values.shipment.ship_to.country_code,
              address_residential_indicator:
                values.shipment.ship_to.address_residential_indicator || "no",
            },
            ship_from: {
              name: values.shipment.ship_from.name || "ShipEngine Team",
              phone: values.shipment.ship_from.phone || "222-333-4444",
              company_name:
                values.shipment.ship_from.company_name || "ShipEngine",
              address_line1:
                values.shipment.ship_from.address_line1 ||
                "4301 Bull Creek Road",
              city_locality:
                values.shipment.ship_from.city_locality || "Austin",
              state_province: values.shipment.ship_from.state_province || "TX",
              postal_code: values.shipment.ship_from.postal_code || "78731", // Correct postal code
              country_code: "US", // Correct country code
              address_residential_indicator:
                values.shipment.ship_from.address_residential_indicator || "no",
            },
            packages: values.shipment.packages.map((pkg) => ({
              package_code: pkg.package_code,
              weight: {
                value: pkg.weight.value,
                unit: pkg.weight.unit,
              },
            })),
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "API-Key": process.env.NEXT_PUBLIC_SHIPENGINE_API_KEY! || "",
          },
        }
      );
      if (response.status !== 200) {
        return;
      }
      setShipmentRates(response.data.rate_response.rates);
      console.log(response.data.rate_response.rates);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error:", error.stack);
        throw new Error(`ShipEngine API error: ${error.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request error:", error.request);
        throw new Error("No response received from ShipEngine API");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        throw new Error(`Error setting up request: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateShipmentLabel = async (rateId: string) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `/api/shipengine/labels/rates/${rateId}`,

        {
          label_format: "pdf",
          label_layout: "4x6",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "API-Key": process.env.NEXT_PUBLIC_SHIPENGINE_API_KEY! || "",
          },
        }
      );
      if (response.status !== 200) {
        return;
      }
      setShipmentLabels(response.data);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error:", error.stack);
        throw new Error(`ShipEngine API error: ${error.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request error:", error.request);
        throw new Error("No response received from ShipEngine API");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        throw new Error(`Error setting up request: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  return loading ? (
    // Full screen loader
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader text="Loading..." />
    </div>
  ) : (
    <>
      {shipmentRates.length === 0 && (
        <div className="space-y-4 px-8 mt-8 w-full  md:max-w-[60%] mx-auto">
          {loading ? (
            <>
              <Loader text="Loading..." />
            </>
          ) : (
            <>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Shiping Rates</CardTitle>
                      <CardDescription>
                        Enter the details for your shipment.
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-8">
                        {/* Ship To Address */}
                        <div>
                          <h3 className="text-lg font-medium">
                            Ship To Address
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="222-333-4444"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.company_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Name (Optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Company Inc."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.address_line1"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="1600 Pennsylvania Avenue NW"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.city_locality"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Washington"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.state_province"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl>
                                    <Input placeholder="DC" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.postal_code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Postal Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="20500" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.country_code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="US" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.ship_to.address_residential_indicator"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Residential Address?</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Toggle for Ship From Address */}
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="show-ship-from"
                            checked={showShipFrom}
                            onCheckedChange={setShowShipFrom}
                          />
                          <label htmlFor="show-ship-from">
                            Show Ship From Address
                          </label>
                        </div>

                        {/* Ship From Address */}
                        {showShipFrom && (
                          <div>
                            <h3 className="text-lg font-medium">
                              Ship From Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="ShipEngine Team"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="222-333-4444"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.company_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="ShipEngine"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.address_line1"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="4301 Bull Creek Road"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.city_locality"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Austin" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.state_province"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <Input placeholder="TX" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.postal_code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="78731" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.country_code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Country Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="US" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipment.ship_from.address_residential_indicator"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Residential Address?</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}

                        {/* Package Details */}
                        <div>
                          <h3 className="text-lg font-medium">
                            Package Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="shipment.packages.0.package_code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Package Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.packages.0.weight.value"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Weight Value</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value)
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="shipment.packages.0.weight.unit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Weight Unit</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select unit..." />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="ounce">
                                        Ounce
                                      </SelectItem>
                                      <SelectItem value="pound">
                                        Pound
                                      </SelectItem>
                                      <SelectItem value="gram">Gram</SelectItem>
                                      <SelectItem value="kilogram">
                                        Kilogram
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {shipmentRates.length == 0 && (
                    <Button type="submit">
                      {" "}
                      {loading ? "loading..." : "Submit Shipment"}{" "}
                    </Button>
                  )}
                </form>
              </Form>
            </>
          )}
        </div>
      )}

      {shipmentLabels ? (
        <div className="px-8 mt-8">
          <h2 className="text-4xl font-semibold text-center py-6">
            Shipment Label
          </h2>
          <div className="space-y-4 flex justify-between flex-wrap">
            <LabelCard data={shipmentLabels} />
          </div>
        </div>
      ) : (
        shipmentRates.length > 0 && (
          <div className="px-8 mt-8">
            <h2 className="text-4xl font-semibold text-center py-6">
              Shipment Rates
            </h2>
            <div className="space-y-4 flex justify-between flex-wrap">
              {shipmentRates.map((rate: ShipmentCardProps) => (
                <ShipmentRatesCard
                  key={rate?.rate_id}
                  rate_id={rate?.rate_id}
                  warning_messages={rate?.warning_messages}
                  delivery_days={rate?.delivery_days}
                  estimated_delivery_date={rate?.estimated_delivery_date}
                  service_type={rate?.service_type}
                  shipping_amount={rate?.shipping_amount}
                  generateShipmentLabel={generateShipmentLabel}
                />
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
}

"use client";

import { title, subtitle } from "@/components/primitives";
import React, { useState } from "react";
import axios from "axios";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"


const dataset = [
  { id: 0, name: "Coke", price: 40, carbs: 11, protein: 0, fat: 0 },
  { id: 1, name: "Parle peri-peri Chips", price: 40, carbs: 57, protein: 7, fat: 34  },
  { id: 2, name: "Lays American Style Cream & Onion", price: 25, carbs: 15, protein: 2, fat: 10 },
  { id: 3, name: "Bikano Aloo Bhujia", price: 20, carbs: 12, protein: 3, fat: 14  },
  { id: 4, name: "Dairy milk", price: 20, carbs: 60, protein: 8, fat: 29 },
  { id: 5, name: "Unibic chocochip", price: 20, carbs: 15, protein: 1, fat: 4 },
  { id: 6, name: "Bauli Moonfils Choco", price: 20, carbs: 59, protein: 6, fat: 17 },
  { id: 7, name: "Goodday Butter", price: 10, carbs: 68, protein: 7, fat: 23 },
  { id: 8, name: "Bauli Goodness Bar", price: 60, carbs: 58, protein: 10, fat: 11  },
  { id: 9, name: "Boomer", price: 10, carbs: 2, protein: 0, fat: 0 },
  { id: 10, name: "Mcvities Dark", price: 30 , carbs: 61, protein: 6, fat: 24 },
];

const columns = [
  { key: "name", label: "ITEM" },
  { key: "price", label: "PRICE" },
];

const chartConfig = {
  carbs: {
    label: "carbs",
    color: "#2563eb",
  },
  protein: {
    label: "protein",
    color: "#60a5fa",
  },
  fat: {
    label: "fat",
    color: "#2063eb",
  },
} satisfies ChartConfig


export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [classes, setClasses] = useState<number[] | null>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);

    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const api_route = "http://127.0.0.1:8000/inferenceModel";

    try {
      const response = await axios.post(api_route, formData);
      console.log("Response:", response.data);

      if (response.data.Image) {
        const detectedClasses = Object.values(response.data.Classes);
        setClasses(detectedClasses);
        setImageSrc(response.data.Image);
      }
    } catch (error) {
      console.error("Error enhancing image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter dataset based on detected classes
  const filteredDataset = dataset.filter(
    (item) => classes?.includes(item.id) || false
  );

  const getTotalCost = () => {
    let cost = 0;

    filteredDataset.map((item) => {
      cost = cost + item.price;
    });

    return cost;
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10 -mt-8">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>See Beyond&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>Labels&nbsp;</h1>
        <br />
        <h1 className={title()}>Detect and Analyze Your Food Instantly.</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          One Snap to Unlock Nutritional Information and More.
        </h2>
      </div>

      {loading ? (
        <Spinner color="secondary" />
      ) : (
        <>
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          {imageSrc && (
            <>
              <div className="mt-4">
                <Image width={500} alt="Model output Image" src={imageSrc} />
              </div>

              <div className="text-center justify-center mt-8">
                <h1 className={title()}>What we&nbsp;</h1>
                <h1 className={title({ color: "violet" })}>Found&nbsp;</h1>

                <h2 className={subtitle({ class: "mt-4" })}>
                  Total Cost: {getTotalCost()} rupees
                </h2>
              </div>

              <Table aria-label="Filtered items">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={filteredDataset}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="text-center justify-center mt-8">
                <h1 className={title()}>Nutritional&nbsp;</h1>
                <h1 className={title({ color: "violet" })}>Overview&nbsp;</h1>

                <h2 className={subtitle({ class: "mt-4" })}>
                  Get the Details on What’s Inside Your Products
                </h2>
              </div>

              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart accessibilityLayer data={filteredDataset}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 7)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="carbs"
                    fill="#e1346f"
                    radius={4}
                  />
                  <Bar dataKey="protein" fill="#2563eb" radius={4} />
                  <Bar dataKey="fat" fill="#fe9107" radius={4} />
                </BarChart>
              </ChartContainer>
            </>
          )}
        </>
      )}
    </section>
  );
}

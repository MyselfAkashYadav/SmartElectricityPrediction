"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface ClusterData {
  cluster: number;
  period: string;
  value: string;
}

export default function Dashboard() {
  const [data, setData] = useState<ClusterData[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [weeklyBillLR, setWeeklyBillLR] = useState<number | null>(null);
  const [weeklyBillAdaBoost, setWeeklyBillAdaBoost] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCluster, setExpandedCluster] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("https://appears-amazing-nepal-amounts.trycloudflare.com /cluster")
      .then((response) => {
        setData(response.data.data);
        setImage(response.data.plot);
        setWeeklyBillLR(response.data.weekly_bill_lr);
        setWeeklyBillAdaBoost(response.data.weekly_bill_adaboost);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-lg text-black">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const toggleCluster = (cluster: number) => {
    setExpandedCluster(expandedCluster === cluster ? null : cluster);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-black">
        Electricity Data Dashboard
      </h1>
      
      <div className="space-y-6">
        {Array.from(new Set(data.map((item) => item.cluster))).map((cluster) => (
          <div key={cluster} className="bg-white rounded-xl shadow-md">
            <button
              onClick={() => toggleCluster(cluster)}
              className="w-full text-left px-6 py-4 text-xl font-bold border-b bg-gray-100 hover:bg-gray-200 transition-colors duration-200 ease-in-out"
            >
              Cluster {cluster}
            </button>
            {expandedCluster === cluster && (
              <div className="px-6 py-4 space-y-2">
                {data
                  .filter((item) => item.cluster === cluster)
                  .map((item, index) => (
                    <div key={index} className="flex justify-between text-black">
                      <span>{item.period}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-black my-4 text-center">
        Weekly Electricity Bill
      </h2>
      <div className="text-lg text-center text-black">
        Linear Regression Prediction: ${weeklyBillLR}
      </div>
      <div className="text-lg text-center text-black">
        AdaBoost Prediction: ${weeklyBillAdaBoost}
      </div>

      <h2 className="text-xl font-bold text-black my-4 text-center">
        Data Plot
      </h2>
      {image && (
        <div className="flex justify-center">
          <img src={image} alt="Cluster Plot" className="rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}
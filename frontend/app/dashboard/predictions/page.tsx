import Predictions from "@/components/dashboard/Predictions/prediction";

export default function PredictionsPage() {
  return (
    <div className="w-full min-h-full px-4 md:px-8">
      <h1 className="text-2xl font-bold text-white py-6">Predictions Dashboard</h1>
      <Predictions />
    </div>
  );
}
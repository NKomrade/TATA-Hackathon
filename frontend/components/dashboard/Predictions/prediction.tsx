import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, TrendingUp, BatteryCharging } from "lucide-react";

const predictions = [
	{
		title: "Cycle Life Forecast",
		description: "Predicted cycles remaining for battery pack.",
		icon: <LineChart className="w-8 h-8 text-[#10a37f]" />,
		value: "742 cycles",
	},
	{
		title: "Health Trend",
		description: "Projected battery health over next 6 months.",
		icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
		value: "82%",
	},
	{
		title: "Charge Efficiency",
		description: "Expected charge efficiency next quarter.",
		icon: <BatteryCharging className="w-8 h-8 text-orange-400" />,
		value: "94%",
	},
];

const Predictions: React.FC = () => (
	<div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
		{predictions.map((pred, idx) => (
			<Card
				key={idx}
				className="bg-slate-800/60 border-slate-600/50 text-white shadow-lg"
			>
				<CardHeader className="flex flex-row items-center gap-4 pb-2">
					{pred.icon}
					<CardTitle className="text-lg font-semibold text-white">
						{pred.title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold mb-2">{pred.value}</div>
					<div className="text-sm text-slate-300">
						{pred.description}
					</div>
				</CardContent>
			</Card>
		))}
	</div>
);

export default Predictions;
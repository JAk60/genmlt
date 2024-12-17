"use client";

import { onSubmit } from "@/app/actions/checboxactions";
import { getParagraphs, Paragraph } from "@/app/Paragraphs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Mountain } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const categories = {
	Category: ["Mission", "Maintenance"],
	"Sub - mission": [
		"Combat",
		"Exercise",
		"Sortie",
		"Humanitarian",
		"Fleet Support",
	],
	Level: ["Fleet", "Ship", "Equipment"],
	Action: ["Select K out of N", "Identify", "Evaluate"],
	Entity: ["Ship", "Equipment", "Workshop"],
	From: ["Fleet", "Ships", "Equipment", "Workshops"],
	Time: ["From Paragraph"],
	Location: ["From Paragraph"],
	"Task Objective": [
		"Interrogation and interception",
		"Gun firing",
		"Missile firing",
		"Search and rescue",
		"Maintenance scheduling",
	],
	"Objective function": [
		"Minimum risk",
		"Maximum availability",
		"Minimum time",
		"Minimum cost",
		"Maximum reliability",
		"Maximum conformance",
		"Minimum downtime",
	],
	"Hard Constraints": [
		"Capability",
		"Speed",
		"Endurance",
		"Ration",
		"Fuel",
		"Spares availability",
		"Reliability",
		"Risk score",
		"Balancing loads",
		"Workshop availability",
		"Manpower availability",
		"Conformance",
	],
	"Soft Constraints": [
		"Fleet availability",
		"Ship class",
		"Working hours",
		"Manpower availability",
		"Logistic time",
		"Activity sequences",
	],
};

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Saving..." : "Save"}
		</Button>
	);
}

export default function CategoryForm() {
	const [currParaId, setCurrParaId] = useState<number>(1);
	const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);

	useEffect(() => {
		const fetchParagraphs = async () => {
			try {
				const fetchedParagraphs = await getParagraphs();
				setParagraphs(fetchedParagraphs || []);
			} catch (error) {
				console.error("Failed to fetch paragraphs:", error);
				setParagraphs([]);
			}
		};

		fetchParagraphs();
	}, []);

	const handlePreviousParagraph = () => {
		setCurrParaId((prevId) => Math.max(1, prevId - 1));
	};

	const handleNextParagraph = () => {
		setCurrParaId((prevId) => Math.min(paragraphs.length, prevId + 1));
	};
	const handleSubmit = async (formData: FormData) => {
		// Add the current paragraph details to the form data
		if (paragraphs.length > 0) {
			const currentParagraph = paragraphs[currParaId - 1];
			formData.append("id", currentParagraph.id.toString());
			formData.append("Scenario", currentParagraph.value);
		}

		// Call the existing onSubmit action
		await onSubmit(formData);
	};
	return (
		<div className="container mx-auto p-6">
			<div className="grid gap-6 md:grid-cols-2">
				<Card className="p-6">
					<div className="min-h-[200px]">
						<div className="flex flex-col mb-4">
							<div className="flex items-center space-x-2">
								<Mountain className="text-4xl" />
								<h2 className="text-center text-4xl font-semibold">
									Scenario {currParaId}
								</h2>
							</div>
						</div>

						{paragraphs.length > 0 && (
							<p
								className="text-4xl font-semibold mb-4"
								key={paragraphs[currParaId - 1].id}
							>
								{paragraphs[currParaId - 1].value}
							</p>
						)}
					</div>
					<div className="flex justify-between mt-4">
						<Button
							variant="outline"
							onClick={handlePreviousParagraph}
							disabled={currParaId <= 1}
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Previous
						</Button>
						<Button
							onClick={handleNextParagraph}
							disabled={currParaId >= paragraphs.length}
						>
							Next
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</Card>

				<Card className="p-6 overflow-auto max-h-[80vh]">
					<form
						action={handleSubmit}
						className="flex flex-col h-full"
					>
						<h2 className="text-lg font-semibold mb-4">
							Category-Based Checkbox Form
						</h2>
						<div className="space-y-6 flex-grow">
							{Object.entries(categories).map(
								([category, subcategories]) => (
									<div key={category}>
										<h3 className="text-md font-medium mb-2">
											{category}
										</h3>
										<div className="grid grid-cols-2 gap-2">
											{subcategories.map(
												(subcategory) => {
													const id = `${category}-${subcategory}`;
													return (
														<div
															key={id}
															className="flex items-center space-x-2"
														>
															<Checkbox
																id={id}
																name={category}
																value={
																	subcategory
																}
															/>
															<label
																htmlFor={id}
																className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
															>
																{subcategory}
															</label>
														</div>
													);
												}
											)}
										</div>
									</div>
								)
							)}
						</div>
						<div className="flex justify-end mt-6">
							<SubmitButton />
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
}

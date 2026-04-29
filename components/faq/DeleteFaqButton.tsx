"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteFaq } from "@/app/faq/actions";

interface Props {
	faqId: string;
}

export function DeleteFaqButton({ faqId }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative self-end">
			<button
				onClick={() => setOpen(true)}
				className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm cursor-pointer"
			>
				<Trash2 size={16} />
				Ta bort
			</button>

			{open && (
				<div className="absolute bottom-12 right-0 bg-white border rounded-lg shadow-lg p-4 w-56 z-10">
					<p className="text-sm text-gray-700 mb-3">
						Är du säker på att du vill ta bort denna FAQ?
					</p>
					<div className="flex justify-end gap-2">
						<button
							onClick={() => setOpen(false)}
							className="px-3 py-1 border rounded-md text-sm cursor-pointer"
						>
							Avbryt
						</button>
						<form action={deleteFaq}>
							<input type="hidden" name="id" value={faqId} />
							<button
								type="submit"
								className="px-3 py-1 bg-red-500 text-white rounded-md text-sm cursor-pointer"
							>
								Ta bort
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type ServerAction = (formData: FormData) => void | Promise<void>;

interface ConfirmActionButtonProps {
	action: ServerAction;
	hiddenFields: Record<string, string | number>;
	message: string;
	triggerLabel?: string;
	confirmLabel?: string;
	cancelLabel?: string;
}

export function ConfirmActionButton({
	action,
	hiddenFields,
	message,
	triggerLabel = "Ta bort",
	confirmLabel = "Ta bort",
	cancelLabel = "Avbryt",
}: ConfirmActionButtonProps) {
	const [open, setOpen] = useState(false);
	const wrapRef = useRef<HTMLDivElement>(null);
	const cancelRef = useRef<HTMLButtonElement>(null);
	const titleId = useId();

	useEffect(() => {
		if (!open) return;

		cancelRef.current?.focus();

		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		function onClickOutside(e: MouseEvent) {
			if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
		}

		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("mousedown", onClickOutside);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("mousedown", onClickOutside);
		};
	}, [open]);

	return (
		<div ref={wrapRef} className="relative inline-flex">
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
				aria-haspopup="dialog"
				aria-expanded={open}
			>
				<Trash2 size={16} aria-hidden="true" />
				{triggerLabel}
			</button>

			{open && (
				<div
					role="dialog"
					aria-modal="false"
					aria-labelledby={titleId}
					className="fixed inset-x-2 bottom-2 w-auto sm:absolute sm:inset-auto sm:bottom-full sm:left-0 sm:mb-2 sm:w-64 bg-white border rounded-lg shadow-lg p-4 z-50"
				>
					<p id={titleId} className="text-sm text-gray-700 mb-3">
						{message}
					</p>

					<div className="flex justify-end gap-2">
						<button
							ref={cancelRef}
							type="button"
							onClick={() => setOpen(false)}
							className="px-3 py-1 border rounded-md text-sm cursor-pointer"
						>
							{cancelLabel}
						</button>

						<form action={action}>
							{Object.entries(hiddenFields).map(([name, value]) => (
								<input
									key={name}
									type="hidden"
									name={name}
									value={String(value)}
								/>
							))}
							<button
								type="submit"
								className="px-3 py-1 bg-red-600 text-white rounded-md text-sm cursor-pointer"
							>
								{confirmLabel}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

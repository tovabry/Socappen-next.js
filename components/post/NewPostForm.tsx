"use client";

import { useState } from "react";
import { createPost } from "@/app/post/actions";

type MediaEntry = { url: string; mediaType: string };

export function NewPostForm() {
	const [mediaList, setMediaList] = useState<MediaEntry[]>([]);

	// Add new media entry to state when user clicks "Lägg till media"
	function addMedia() {
		setMediaList((prev) => [...prev, { url: "", mediaType: "image" }]);
	}

	// Remove media entry from state when user clicks "Ta bort"
	function removeMedia(index: number) {
		setMediaList((prev) => prev.filter((_, i) => i !== index));
	}

	// Update media entry in state when user changes input
	function updateMedia(index: number, field: keyof MediaEntry, value: string) {
		setMediaList((prev) =>
			prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
		);
	}

	return (
		<form action={createPost} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<label htmlFor="title" className="text-sm font-medium">
					Titel
				</label>
				<input
					id="title"
					name="title"
					className="p-2 border rounded-md"
					required
				/>
			</div>
			<div className="flex flex-col gap-1">
				<label htmlFor="content" className="text-sm font-medium">
					Innehåll
				</label>
				<textarea
					id="content"
					name="content"
					rows={8}
					className="p-2 border rounded-md resize-none"
					required
				/>
			</div>

			{mediaList.length > 0 && (
				<ul className="flex flex-col gap-2">
					{mediaList.map((m, i) => (
						<li
							key={i}
							className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border rounded-md p-2"
						>
							<select
								name="mediaType"
								value={m.mediaType}
								onChange={(e) => updateMedia(i, "mediaType", e.target.value)}
								className="p-2 border rounded-md text-sm"
							>
								<option value="image">Bild</option>
								<option value="video">Video</option>
							</select>
							<input
								name="mediaUrl"
								value={m.url}
								onChange={(e) => updateMedia(i, "url", e.target.value)}
								placeholder="https://..."
								className="flex-1 p-2 border rounded-md text-sm"
							/>
							<button
								type="button"
								onClick={() => removeMedia(i)}
								className="text-red-500 text-xs border border-red-500 rounded px-2 py-1 sm:self-auto self-end"
							>
								Ta bort
							</button>
						</li>
					))}
				</ul>
			)}

			<button
				type="button"
				onClick={addMedia}
				className="text-sm mt-3 border rounded-2xl px-3 py-1 text-(--bg-secondary-color-red) shadow-md"
			>
				+ Lägg till media
			</button>

			<button
				type="submit"
				className="self-end px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
			>
				Publicera
			</button>
		</form>
	);
}

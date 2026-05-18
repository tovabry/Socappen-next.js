"use client";

import { deletePost } from "@/app/post/actions";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";

interface Props {
	postId: string;
}

export function DeletePostButton({ postId }: Props) {
	return (
		<ConfirmActionButton
			action={deletePost}
			hiddenFields={{ postId }}
			message="Är du säker på att du vill ta bort detta inlägg?"
		/>
	);
}

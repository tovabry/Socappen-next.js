"use client";

import { deleteFaq } from "@/app/faq/actions";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";

interface Props {
	faqId: string;
}

export function DeleteFaqButton({ faqId }: Props) {
	return (
		<ConfirmActionButton
			action={deleteFaq}
			hiddenFields={{ id: faqId }}
			message="Är du säker på att du vill ta bort denna FAQ?"
		/>
	);
}

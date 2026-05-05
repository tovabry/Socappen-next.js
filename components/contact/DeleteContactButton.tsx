"use client";

import { deleteContact } from "@/app/contacts/actions";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";

interface Props {
	contactId: string;
}

export function DeleteContactButton({ contactId }: Props) {
	return (
		<ConfirmActionButton
			action={deleteContact}
			hiddenFields={{ id: contactId }}
			message="Är du säker på att du vill ta bort denna kontakt?"
		/>
	);
}

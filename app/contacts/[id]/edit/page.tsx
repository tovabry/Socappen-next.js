import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import { updateContact } from "../../actions";
import { DeleteContactButton } from "@/components/contact/DeleteContactButton";
import { getRoles } from "@/lib/getRole";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function ContactEditPage({ params }: Props) {
	const { id } = await params;
	const { isAdmin } = await getRoles();
	if (!isAdmin) redirect(`/contacts/${id}`);

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${id}`);
	const contact = await res.json();

	return (
		<div className="w-full">
			<Header title="Redigera kontakt" backRouteLink={`/contacts`} />
			<main className="mx-6 my-6 flex flex-col gap-6">
				<section className="bg-white rounded-lg shadow-md p-6">
					<form action={updateContact} className="flex flex-col gap-4">
						<input type="hidden" name="contactId" value={id} />
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Namn</label>
							<input
								name="title"
								defaultValue={contact.title}
								className="p-2 border rounded-md"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Bild-URL</label>
							<input
								name="imgUrl"
								defaultValue={contact.imgUrl}
								className="p-2 border rounded-md"
								placeholder="https://..."
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">E-post</label>
							<input
								name="mail"
								type="email"
								defaultValue={contact.mail}
								className="p-2 border rounded-md"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Telefon</label>
							<input
								name="phone"
								defaultValue={contact.phone}
								className="p-2 border rounded-md"
								required
							/>
						</div>

						<div className="flex flex-row justify-end gap-4 mt-4">
							<button
								type="submit"
								className="self-end px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
							>
								Spara
							</button>
						</div>
					</form>
				</section>
				<section className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-2">Ta bort inlägg</h2>
					<p className="text-sm text-gray-500 mb-4">
						Åtgärden kan inte ångras.
					</p>
					<DeleteContactButton contactId={contact.id.toString()} />
				</section>
			</main>
		</div>
	);
}

import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { createContact } from "../actions";
import { getRoles } from "@/lib/getRole";
import { hasPermission } from "@/lib/getPermissions";

export default async function ContactNewPage() {
	const { isAdmin } = await getRoles();
	const hasContactPermissions = await hasPermission("manage_contact");
	if (!isAdmin || !hasContactPermissions) redirect("/contacts");

	return (
		<div className="w-full">
			<Header title="Ny kontakt" backRouteLink="/contacts" />
			<section className="flex flex-col mt-10 bg-white p-6 rounded-lg shadow-md mx-10 gap-4">
				<form action={createContact} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Namn</label>
						<input name="title" className="p-2 border rounded-md" required />
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Bild-URL</label>
						<input
							name="imgUrl"
							className="p-2 border rounded-md"
							placeholder="https://..."
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">E-post</label>
						<input
							name="mail"
							type="email"
							className="p-2 border rounded-md"
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Telefon</label>
						<input name="phone" className="p-2 border rounded-md" required />
					</div>
					<button
						type="submit"
						className="self-end px-4 py-2 bg-(--accent-lightblue) text-white rounded-md text-sm shadow-md"
					>
						Skapa
					</button>
				</form>
			</section>
		</div>
	);
}

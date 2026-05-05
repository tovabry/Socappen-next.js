import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { createFaq } from "../actions";
import { getRoles } from "@/lib/getRole";
import { hasPermission } from "@/lib/getPermissions";

export default async function FaqNewPage() {
	const { isAdmin } = await getRoles();
	const hasFaqPermissions = await hasPermission("manage_faq");

	if (!isAdmin || !hasFaqPermissions) redirect("/faq");

	return (
		<div className="w-full">
			<Header title="Ny FAQ" backRouteLink="/faq" />
			<section className="flex flex-col mt-10 bg-white p-6 rounded-lg shadow-md mx-10 gap-4">
				<form action={createFaq} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Fråga</label>
						<input name="question" className="p-2 border rounded-md" required />
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Svar</label>
						<textarea
							name="answer"
							rows={5}
							className="p-2 border rounded-md resize-none"
							required
						/>
					</div>
					<button
						type="submit"
						className="self-end px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
					>
						Skapa
					</button>
				</form>
			</section>
		</div>
	);
}

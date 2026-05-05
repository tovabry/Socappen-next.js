import { Header } from "@/components/Header";

interface ContactResponse {
	id: number;
	title: string;
	imgUrl: string;
	mail: string;
	phone: string;
}

interface Props {
	contacts: ContactResponse[];
	isAdmin: boolean;
	hasContactPermissions: boolean;
}

export function ContactList({
	contacts,
	isAdmin,
	hasContactPermissions,
}: Props) {
	return (
		<div className="w-full">
			<Header title="Kontakter" backRouteLink="/home" />
			<div className="flex items-center gap-4 mx-6 mt-5 justify-end">
				{isAdmin && hasContactPermissions && (
					<a
						href="/contacts/new"
						className="px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
					>
						+ Lägg till ny kontakt
					</a>
				)}
			</div>
			<main className="flex flex-col gap-4 mx-6 mt-4 md:grid md:grid-cols-2 lg:grid-cols-3">
				{contacts.map((contact, index) => (
					<section
						key={index}
						className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center gap-4 overflow-hidden"
					>
						<img
							src={contact.imgUrl}
							alt={contact.title}
							className="w-16 h-16 rounded-full object-contain"
							aria-label={`Image for contact: ${contact.title}`}
						/>
						<div className="flex flex-col gap-2 w-full min-w-0">
							<h3 className="text-xl font-semibold wrap-break-word">
								{contact.title}
							</h3>
							<a
								href={`mailto:${contact.mail}`}
								className="text-gray-600 wrap-break-word"
								aria-label={`Mail to contact: ${contact.title}`}
							>
								E-post: {contact.mail}
							</a>
							<a
								href={`tel:${contact.phone}`}
								className="text-gray-600 wrap-break-word"
								aria-label={`Call to contact: ${contact.title}`}
							>
								Telefon: {contact.phone}
							</a>
							<div className="flex flex-row justify-end">
								{isAdmin && hasContactPermissions && (
									<div className="flex gap-2">
										<a
											href={`/contacts/${contact.id}/edit`}
											aria-label={`Redigera kontakt: ${contact.title}`}
											className="px-3 py-1 text-sm border rounded-md shadow-md"
										>
											Redigera
										</a>
									</div>
								)}
							</div>
						</div>
					</section>
				))}
			</main>
		</div>
	);
}

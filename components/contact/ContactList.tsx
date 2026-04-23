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
}

export function ContactList({ contacts, isAdmin }: Props) {
	return (
		<div className="w-full">
			<Header title="Kontakter" backRouteLink="/home" />
			<div className="flex items-center gap-4 mx-6 mt-5 justify-end">
				{isAdmin && (
					<a
						href="/contacts/new"
						className="px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
					>
						+ Lägg till ny kontakt
					</a>
				)}
			</div>
			<main className="mx-6 mt-6">
				{contacts.map((contact, index) => (
					<section
						key={index}
						className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center gap-4 overflow-hidden"
					>
						<img
							src={contact.imgUrl}
							alt={contact.title}
							className="w-16 h-16 rounded-full object-contain"
						/>
						<div className="flex flex-col gap-2 w-full min-w-0">
							<h3 className="text-xl font-semibold wrap-break-word">
								{contact.title}
							</h3>
							<a
								href={`mailto:${contact.mail}`}
								className="text-gray-600 wrap-break-word"
							>
								E-post: {contact.mail}
							</a>
							<a
								href={`tel:${contact.phone}`}
								className="text-gray-600 wrap-break-word"
							>
								Telefon: {contact.phone}
							</a>
							<div className="flex flex-row justify-end">
								{isAdmin && (
									<div className="flex gap-2">
										<a
											href={`/contacts/${contact.id}/edit`}
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

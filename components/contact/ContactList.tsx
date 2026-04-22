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
						className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center gap-4"
					>
						<img
							src={contact.imgUrl}
							alt={contact.title}
							className="w-16 h-16 rounded-full object-contain"
						/>
						<div className="flex flex-col">
							<h3 className="text-xl font-semibold">{contact.title}</h3>
							<a href={`mailto:${contact.mail}`} className="text-gray-600">
								E-post: {contact.mail}
							</a>
							<a href={`tel:${contact.phone}`} className="text-gray-600">
								Telefon: {contact.phone}
							</a>
						</div>
					</section>
				))}
			</main>
		</div>
	);
}

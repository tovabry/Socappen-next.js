import { ContactsCard } from "@/components/ContactsCard";
import { Header } from "@/components/Header";

export default function ContactPage() {
	return (
		<div>
			<Header title="Kontakt" backRouteLink="/home" />
			<div className="flex flex-col items-center">
				<h1 className="text-2xl font-semibold">Kontakter</h1>
				<ContactsCard
					contactName="BRIS"
					contactDescription="Exempel beskrivning"
					contactNumber="+123456789"
					contactWebsite="https://www.bris.se"
				/>
				<ContactsCard contactName="Exempel" />
			</div>
		</div>
	);
}

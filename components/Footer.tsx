import { Globe, Mail } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-(--bg-secondary-color-red) text-white py-4 shadow-lg mt-4 overflow-hidden">
			<div className="flex flex-col md:flex-row md:justify-around justify-between px-8 gap-4">
				<section className="flex flex-col min-w-0 text-start">
					<h3 className="text-lg font-semibold">Om oss</h3>
					<div className="inline-block mb-4">
						<div className="h-1 w-16 bg-white rounded-full"></div>
					</div>
					<p className="text-md mb-2">Resursenheten hanterar frågor om:</p>
					<ul className="list-disc list-inside text-sm">
						<li>Familjefrågor</li>
						<li>Ungdomsfrågor</li>
						<li>Stöd och rådgivning</li>
					</ul>
				</section>

				<section className="flex flex-col min-w-0 text-start">
					<h3 className="text-lg font-semibold">Kontakt</h3>
					<div className="inline-block mb-4">
						<div className="h-1 w-16 bg-white rounded-full"></div>
					</div>
					<p className="text-md">Öppettider: 10:00 - 16:00</p>
					<p className="text-md">Telefon: 0322-000 00</p>
					<p className="text-md">Mail:</p>
					<a
						href="mailto:resursenheten@herrljunga.se"
						className="text-md text-white"
						aria-label="Länk till mail-adress"
					>
						<Mail size={16} className="inline-block" />{" "}
						Resursenheten@herrljunga.se
					</a>
					<p className="text-md">Webbsida:</p>
					<a
						href="https://www.exempel.se"
						className="text-md text-white"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Besök Exempel webbplats"
					>
						<Globe size={16} className="inline-block" /> www.exempel.se
					</a>
				</section>
			</div>
		</footer>
	);
}

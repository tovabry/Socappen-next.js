interface ContactsCardProps {
	contactName: string;
	contactDescription?: string;
	contactNumber?: string;
	contactWebsite?: string;
}

export function ContactsCard({
	contactName,
	contactDescription,
	contactNumber,
	contactWebsite,
}: ContactsCardProps) {
	return (
		<article className="flex flex-col gap-2 rounded-lg border p-4 shadow-md bg-white mt-5 w-[calc(100%-80px)]">
			<div className="flex flex-col items-center justify-center">
				<h2 className="text-lg font-semibold">{contactName}</h2>
				{contactDescription && <p className="text-sm">{contactDescription}</p>}
			</div>
			<div className="flex flex-row justify-between items-center px-4 py-2">
				{contactNumber && <p>{contactNumber}</p>}
				{contactWebsite && (
					<a
						href={
							contactWebsite.startsWith("http")
								? contactWebsite
								: `https://${contactWebsite}`
						}
						className=" hover:underline text-blue-400"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Besök ${contactName} webbplats`}
					>
						{contactWebsite.slice(contactWebsite.indexOf(".") + 1)}
					</a>
				)}
			</div>
		</article>
	);
}

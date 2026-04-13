export function Footer() {
	return (
		<footer className="bg-[#DF5E5E] text-white text-center py-4 shadow-lg mt-4">
			<div className="flex flex-row justify-between mx-8 gap-4">
				<section className="flex flex-col flex-1 text-start">
					<h3 className="text-lg">Om oss</h3>

					<p className="text-sm ">
						Resursenheten hanterar frågor om:
						<ul className="list-disc list-inside">
							<li>Familjefrågor</li>
							<li>Ungdomsfrågor</li>
							<li>Stöd och rådgivning</li>
						</ul>
					</p>
				</section>
				<section className="flex flex-col flex-1 text-start">
					<h3 className="text-lg">Kontakt</h3>
					<p className="text-sm">
						Vill du ha snabb kontakt med oss kan du ringa oss <br /> Öppettider
						för telefon: <br /> 10:00 - 16:00 <br />
						Telefon: <br /> 0322-000 00 <br /> Mail: <br />{" "}
						resursenheten@herrljunga.se <br /> Länk
					</p>
				</section>
			</div>
		</footer>
	);
}

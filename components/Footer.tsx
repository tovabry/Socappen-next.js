export function Footer() {
	return (
		<footer className="bg-[#DF5E5E] text-white text-center py-4 shadow-lg mt-4">
			<div className="flex flex-row justify-between mx-8 gap-4">
				<section className="flex flex-col flex-1 text-start md:max-w-[50%] md:text-center">
					<h3 className="text-lg mb-2">Om oss</h3>

					<p className="text-sm mb-2">Resursenheten hanterar frågor om:</p>
					<ul className="list-disc list-inside text-sm">
						<li>Familjefrågor</li>
						<li>Ungdomsfrågor</li>
						<li>Stöd och rådgivning</li>
					</ul>
				</section>
				<section className="flex flex-col flex-1 text-start md:max-w-[50%] md:text-center">
					<h3 className="text-lg mb-2">Kontakt</h3>
					<p className="text-sm">
						Vill du ha snabb kontakt med oss kan du ringa oss. <br /> Öppettider
						för telefon: <br /> 10:00 - 16:00 <br />
						Telefon: <br /> 0322-000 00 <br /> Mail: <br />
						resursenheten@herrljunga.se <br /> Länk: <br />
					</p>
				</section>
			</div>
		</footer>
	);
}

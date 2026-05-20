import { Header } from "@/components/Header";
import { addEmailForNotifications } from "./actions";

export default async function EmailNotifications() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header title="System Administratör" backRouteLink="/sysadmin" />
			<main className="flex-1 my-4 md:w-2/3 lg:w-1/2 mx-auto">
				<div className="rounded-md shadow-md mx-5 mt-5 bg-(--accent-lightblue)/70 p-4">
					<form
						action={addEmailForNotifications}
						className="flex flex-col gap-4"
					>
						<div className="mb-4">
							<label
								htmlFor="email"
								className="block text-white text-sm font-bold mb-2"
							>
								E-postadress för aviseringar
							</label>
							<input
								type="email"
								id="email"
								name="email"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								placeholder="exempel@domän.com"
							/>
						</div>
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Spara
						</button>
					</form>
				</div>
			</main>
		</div>
	);
}

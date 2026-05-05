import Link from "next/link";
import { Header } from "@/components/Header";
import { getRoles } from "@/lib/getRole";
import { serverFetch } from "@/lib/serverFetch";
import { redirect } from "next/navigation";
import { promoteToAdmin, demoteToUser, deleteUserAccount } from "./actions";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";

interface UserRow {
	id: number;
	email: string;
	status: string;
	role: string; // ex: ROLE_USER / ROLE_ADMIN / ROLE_SYSADMIN
	online: boolean;
}

function normalizeRole(role: string) {
	return role.replace("ROLE_", "").toLowerCase(); // user/admin/sysadmin
}

export default async function UsersPage({
	searchParams,
}: {
	searchParams: Promise<{ role?: string }>;
}) {
	const { isSysAdmin, isAdmin } = await getRoles();
	if (!isSysAdmin && !isAdmin) redirect("/home");

	const { role = "all" } = await searchParams;

	const res = await serverFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/all`);
	if (!res.ok) return <div>Kunde inte hämta användare.</div>;

	const users: UserRow[] = await res.json();

	const filteredUsers =
		role === "all"
			? users
			: users.filter((u) => normalizeRole(u.role) === role);

	const roleFilters = ["all", "user", "admin", "sysadmin"];

	return (
		<div className="w-full">
			<Header title="Hantera konton" backRouteLink="/sysadmin" />

			<div className="mx-6 mt-4">
				<nav
					aria-label="Filtrera användare efter roll"
					className="flex flex-wrap gap-2"
				>
					{roleFilters.map((r) => {
						const active = role === r;
						const href =
							r === "all" ? "/sysadmin/users" : `/sysadmin/users?role=${r}`;
						return (
							<Link
								key={r}
								href={href}
								className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
									active
										? "bg-(--bg-secondary-color-red) text-white border-(--bg-secondary-color-red) shadow-md"
										: "bg-white text-gray-700 border-gray-200 shadow-md"
								}`}
								aria-current={active ? "page" : undefined}
							>
								{r === "all" ? "Alla" : r.charAt(0).toUpperCase() + r.slice(1)}
							</Link>
						);
					})}
				</nav>
			</div>

			<main className="mx-6 mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredUsers.map((user) => (
					<article key={user.id} className="bg-white rounded-lg shadow-md p-5">
						<h2 className="font-semibold wrap-break-word">{user.email}</h2>
						<p className="text-sm mt-2">ID: {user.id}</p>
						<p className="text-sm">Status: {user.status}</p>
						<p className="text-sm">Online: {user.online ? "Ja" : "Nej"}</p>
						<p className="text-sm">Roll: {normalizeRole(user.role) || "-"}</p>

						<div className="mt-4 flex flex-col gap-2">
							<Link
								href={`/sysadmin/users/${user.id}`}
								className="w-full text-center text-sm border rounded-md px-3 py-2"
							>
								Hantera behörigheter
							</Link>

							<form action={promoteToAdmin}>
								<input type="hidden" name="userId" value={user.id} />
								<button
									type="submit"
									className="w-full text-sm px-3 py-2 rounded-md bg-(--bg-secondary-color-red) text-white cursor-pointer"
								>
									Ge admin
								</button>
							</form>

							<form action={demoteToUser}>
								<input type="hidden" name="userId" value={user.id} />
								<button
									type="submit"
									className="w-full text-sm px-3 py-2 rounded-md border cursor-pointer"
								>
									Ta bort admin
								</button>
							</form>

							<ConfirmActionButton
								action={deleteUserAccount}
								hiddenFields={{ userId: user.id }}
								message="Är du säker på att du vill ta bort detta konto?"
							/>
						</div>
					</article>
				))}
			</main>
		</div>
	);
}

import { Header } from "@/components/Header";
import { getRoles } from "@/lib/getRole";
import { serverFetch } from "@/lib/serverFetch";
import { redirect } from "next/navigation";
import { grantPermission, revokePermission } from "../actions";

type ResponsePermission = {
	id: number;
	name: string;
};

type ResponseAdminPermission = {
	id: number;
	userId: number;
	permissionId: number;
	permissionName: string;
	grantedAt: string;
	updatedAt: string;
	grantedBy: number;
};

export default async function UserDetailPage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = await params;
	const { isSysAdmin } = await getRoles();
	if (!isSysAdmin) redirect("/home");

	const [allRes, userRes] = await Promise.all([
		serverFetch(`${process.env.NEXT_PUBLIC_API_URL}/sysadmin/permissions`),
		serverFetch(
			`${process.env.NEXT_PUBLIC_API_URL}/sysadmin/permissions/${userId}`,
		),
	]);

	if (!allRes.ok || !userRes.ok) {
		return <div>Kunde inte hämta behörigheter.</div>;
	}

	const allPermissions: ResponsePermission[] = await allRes.json();
	const userPermissions: ResponseAdminPermission[] = await userRes.json();

	const userPermissionIds = new Set(userPermissions.map((p) => p.permissionId));
	const availablePermissions = allPermissions.filter(
		(p) => !userPermissionIds.has(p.id),
	);

	return (
		<div className="w-full">
			<Header title={`Användare ${userId}`} backRouteLink="/sysadmin/users" />
			<main className="mx-6 mt-4 grid gap-4 md:grid-cols-2">
				<section className="bg-white rounded-lg shadow-md p-5">
					<h2 className="font-semibold mb-3">Tilldelade behörigheter</h2>
					<div className="space-y-2">
						{userPermissions.map((permission) => (
							<form
								key={permission.id}
								action={revokePermission}
								className="flex items-center justify-between border rounded-md p-2"
							>
								<span>{permission.permissionName}</span>
								<div>
									<input type="hidden" name="userId" value={userId} />
									<input
										type="hidden"
										name="permissionId"
										value={permission.permissionId}
									/>
									<button
										type="submit"
										className="text-sm px-3 py-1 border rounded-md cursor-pointer shadow-md"
									>
										Ta bort
									</button>
								</div>
							</form>
						))}
					</div>
				</section>

				<section className="bg-white rounded-lg shadow-md p-5">
					<h2 className="font-semibold mb-3">Tillgängliga behörigheter</h2>
					<div className="space-y-2">
						{availablePermissions.map((permission) => (
							<form
								key={permission.id}
								action={grantPermission}
								className="flex items-center justify-between border rounded-md p-2"
							>
								<span>{permission.name}</span>
								<div>
									<input type="hidden" name="userId" value={userId} />
									<input
										type="hidden"
										name="permissionId"
										value={permission.id}
									/>
									<button
										type="submit"
										className="text-sm px-3 py-1 bg-(--bg-secondary-color-red) text-white rounded-md cursor-pointer shadow-md"
									>
										Lägg till
									</button>
								</div>
							</form>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}

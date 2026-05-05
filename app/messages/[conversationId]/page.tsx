import { redirect } from "next/navigation";
import { getRoles } from "@/lib/getRole";
import { serverFetch } from "@/lib/serverFetch";
import MessagesClient from "./MessageClient";

export default async function Page({
	params,
}: {
	params: Promise<{ conversationId: string }>;
}) {
	const { conversationId } = await params;
	const id = Number(conversationId);

	const { isAdmin, isUser, isSysAdmin } = await getRoles();
	if (!isAdmin && !isUser && !isSysAdmin) redirect("/home");
	if (!Number.isFinite(id)) redirect("/messages");

	const myRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/conversations/my?page=0&size=500`,
		{ cache: "no-store" },
	);

	if (!myRes.ok) redirect("/messages");

	const mine: Array<{ id: number }> = await myRes.json();
	if (!mine.some((c) => c.id === id)) redirect("/messages");

	return <MessagesClient conversationId={conversationId} />;
}

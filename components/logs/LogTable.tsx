import { Header } from "../Header";

interface Column<T> {
	id: number;
	header: string;
	render: (row: T) => React.ReactNode;
}

interface LogTableProps<T> {
	title: string;
	columns: Column<T>[];
	data: T[];
}

export function LogTable<T extends { id: number }>({
	title,
	columns,
	data,
}: LogTableProps<T>) {
	return (
		<div className="w-full">
			<Header title={title} backRouteLink="/sysadmin/logs" />
			{/* Table for bigger screens */}
			<div className="hidden md:block overflow-x-auto mt-5">
				<table className="min-w-full bg-white">
					<thead>
						<tr>
							{columns.map((col) => (
								<th key={col.id} className="px-4 py-2 border-b text-left">
									{col.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row) => (
							<tr key={row.id}>
								{columns.map((col) => (
									<td key={col.id} className="px-4 py-2 border-b">
										{col.render(row)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="md:hidden space-y-3 mt-5">
				{data.map((row) => (
					<div key={row.id} className="bg-white rounded shadow p-4 space-y-1">
						{columns.map((col) => (
							<div
								key={col.id}
								className="flex justify-between text-sm border-b pb-1"
							>
								<span className="text-gray-500">{col.header}</span>
								<span>{col.render(row)}</span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

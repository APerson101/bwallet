<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	export let table: any;

	$: {
		console.log(table.data);
	}
</script>

<Table.Root class="text-white">
	<Table.Caption>{table.caption}</Table.Caption>
	<Table.Header>
		<Table.Row>
			{#each table.headers as header}
				<Table.Head>{header}</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each table.data as data}
			<Table.Row>
				<Table.Cell>{data[0]}</Table.Cell>
				<Table.Cell>{data[1]}</Table.Cell>
				<Table.Cell>{data[2]}</Table.Cell>
				<Table.Cell>{data[3]}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
